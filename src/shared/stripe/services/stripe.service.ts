import { BadRequestException, Injectable } from '@nestjs/common';

import { CONFIG_VAR } from 'src/config';
import { ClerkPayload } from 'src/modules/auth/types';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentIntentDto } from '../dtos';
import { Order } from './../../../modules/orders/types/order.type';
import { OrderService } from 'src/modules/orders/services';
import { STRIPE_ERRORS } from 'src/common/contents/errors/stripe.error';
import Stripe from 'stripe';
import { User } from '@prisma/client';
import { UserKeys } from 'src/modules/users/entities';
import { UserService } from 'src/modules/users/services';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private _configService: ConfigService,
    private readonly _userService: UserService,
    private readonly _orderService: OrderService,
  ) {
    this.stripe = new Stripe(
      _configService.getOrThrow(CONFIG_VAR.STRIPE_API_SECRET_KEY),
      {
        apiVersion: '2024-06-20',
      },
    );
  }

  async createCustomer(user: User): Promise<Stripe.Customer> {
    const { firstName, lastName, email, phone, dob } = user;
    const params: Stripe.CustomerCreateParams = {
      name: `${firstName} ${lastName}`,
      email: email,
      phone: phone,
      metadata: {
        dob: dob && dob.toDateString(),
        localId: user.id,
        clerkId: user.clerkId,
        username: user.userName,
        gender: user.gender,
        role: user.role,
      },
    };
    return this.stripe.customers.create(params);
  }

  async createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
    const params: Stripe.SetupIntentCreateParams = {
      customer: customerId,
      payment_method_types: ['bancontact', 'card', 'ideal'],
    };

    return this.stripe.setupIntents.create(params);
  }

  async getListPaymentMethods(customerId: string): Promise<any> {
    const params: Stripe.PaymentMethodListParams = {
      customer: customerId,
      type: 'card',
    };

    return this.stripe.paymentMethods.list(params);
  }

  async detachPaymentMethod(paymentMethodId: string): Promise<any> {
    return this.stripe.paymentMethods.detach(paymentMethodId);
  }

  async createPaymentIntent(
    data: CreatePaymentIntentDto,
    user: ClerkPayload,
  ): Promise<Stripe.PaymentIntent> {
    if (!user.localUser.customerId) {
      const customer = await this.createCustomer(user.localUser);
      data.customer = customer.id;
      await this._userService.update(
        { id: user.localId },
        { customerId: customer.id },
      );
    }

    const creaetOrder = await this._orderService.create(
      data.order,
      user.localId,
    );
    data.amount =
      data.amount == creaetOrder.data!.totalPrice
        ? data.amount
        : creaetOrder.data!.totalPrice * 100;
    data.metadata = {
      orderId: creaetOrder.data!.id,
    };
    const { order, ...rest } = data;

    const paymentIntent = await this.stripe.paymentIntents.create(rest);
    if (!paymentIntent) {
      await this._orderService.delete({ id: creaetOrder.data!.id });
      throw new BadRequestException(STRIPE_ERRORS.CREATED_PAYMENT_INTENT_ERROR);
    }

    return paymentIntent;
  }

  constructEvent(payload: Buffer | string, signature: string, secret: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        secret,
      );
      return event;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async retrieveCharge(chargeId: string): Promise<Stripe.Charge> {
    return this.stripe.charges.retrieve(chargeId);
  }
}
