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

  async createAccount(): Promise<Stripe.Account> {
    return this.stripe.accounts.create({
      business_type: 'individual',
      individual: {
        first_name: 'Jenny',
        last_name: 'Rosen',
        dob: {
          day: 13,
          month: 4,
          year: 1970,
        },
      },
      type: 'custom',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      email: 'NnVQz@example.com',
    });
  }

  async createBankAccount(accountId: string): Promise<Stripe.ExternalAccount> {
    const bankAccount = await this.stripe.accounts.createExternalAccount(
      accountId,
      {
        external_account: {
          account_number: '000123456',
          object: 'bank_account',
          country: 'SG',
          currency: 'sgd',
          account_holder_name: 'Jenny Rosen',
          account_holder_type: 'individual',
          routing_number: '7171-001',
        },
      },
    );
    return bankAccount;
  }

  async updateAccount(accountId: string): Promise<Stripe.Account> {
    return this.stripe.accounts.update(accountId, {
      business_profile: {
        url: 'https://accessible.stripe.com',
      },
      individual: {
        id_number: '000000000',
        email: 'NnVQz@example.com',
        phone: '+65 6123 4567',
        address: {
          line1: 'address_full_match',
          country: 'SG',
        },
        verification: {
          document: {
            front: 'file_identity_document_success',
            // back: 'file_identity_document_success',
          },
        },
        full_name_aliases: ['Jenny Rosen'],
        dob: {
          day: 1,
          month: 1,
          year: 1900,
        },
        registered_address: {
          line1: 'address_full_match',
        },
      },
      tos_acceptance: {
        date: 1609798905,
        ip: '8.8.8.8',
      },
    });
  }

  async createAccountLink(id: string): Promise<Stripe.AccountLink> {
    return this.stripe.accountLinks.create({
      account: id,
      refresh_url: 'https://example.com/reauth',
      return_url: 'https://example.com/return',
      type: 'account_onboarding',
    });
  }

  async connectAccount(id: string): Promise<Stripe.Account> {
    return this.stripe.accounts.retrieve(id, {
      stripeAccount: id,
    });
  }

  async updatePerson(id: string, personId: string): Promise<Stripe.Person> {
    return await this.stripe.accounts.updatePerson(id, personId, {
      nationality: 'SG',
    });
  }
}
