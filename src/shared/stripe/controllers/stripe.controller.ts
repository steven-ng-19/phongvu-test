import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Patch,
  Post,
  RawBody,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { StripeService } from '../services';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CONFIG_VAR } from 'src/config';
import { ClerkAuthGuard } from 'src/modules/auth/guards';
import { RequestUser } from 'src/common/decorators';
import { ClerkPayload } from 'src/modules/auth/types';
import { CreatePaymentIntentDto, CreatePaymentIntentValidator } from '../dtos';
import { ResponseStripe } from '../types';
import { OrderService } from 'src/modules/orders/services';
import { OrderStatus } from 'src/modules/orders/enums';
import { OK } from 'zod';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('stripe')
// Not write controller for this share module
export class StripeController {
  constructor(
    private readonly _stripeService: StripeService,
    private readonly _configService: ConfigService,
    private readonly _orderService: OrderService,
  ) {}

  @Post()
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') stripeSignature: string,
  ): Promise<string> {
    const endpointSecret = this._configService.get(
      CONFIG_VAR.STRIPE_WEBHOOK_SECRET_KEY,
    );

    const event = this._stripeService.constructEvent(
      req.rawBody!,
      stripeSignature,
      endpointSecret,
    );

    switch (event.type) {
      case 'payment_intent.created':
        console.log(event);
        break;

      case 'payment_intent.succeeded':
        const order = await this._orderService.changeStatus(
          { id: event.data.object.metadata.orderId },
          { status: OrderStatus.PAID, paymentId: event.data.object.id },
        );
        break;

      case 'account.updated':
        console.log(event);
        break;

      case 'account.external_account.created':
        console.log(event);
        break;

      default:
        console.log(event);
    }
    return 'success';
  }

  @Post('connect-account')
  async handleStripeWebhookConnectAccount(
    @Req() req: Request,
    @Headers('stripe-signature') stripeSignature: string,
  ): Promise<string> {
    const endpointSecret = this._configService.get(
      CONFIG_VAR.STRIPE_WEBHOOK_CONNECT_ACCOUNT_SECRET_KEY,
    );

    const event = this._stripeService.constructEvent(
      req.rawBody!,
      stripeSignature,
      endpointSecret,
    );

    switch (event.type) {
      case 'account.updated':
        console.log(event);
        break;

      case 'account.application.authorized':
        console.log(event);
        break;

      case 'account.external_account.created':
        console.log(event);
        break;

      default:
        console.log(event);
    }
    return 'success';
  }

  @Post('create-payment-intent')
  @UseGuards(ClerkAuthGuard)
  @UsePipes(ZodValidationPipe)
  async createPaymentIntent(
    @RequestUser() user: ClerkPayload,
    @Body()
    data: CreatePaymentIntentDto,
  ): Promise<ResponseStripe> {
    const paymentIntent = await this._stripeService.createPaymentIntent(
      data,
      user,
    );
    return {
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentIntent.id,
    };
  }

  @Post('create-account')
  async createAccount(): Promise<any> {
    return this._stripeService.createAccount();
  }

  @Post('create-bank-account/:id')
  async createBankAccount(@Param('id') id: string): Promise<any> {
    return this._stripeService.createBankAccount(id);
  }

  @Patch('update-bank-account/:id')
  async updateBankAccount(@Param('id') id: string): Promise<any> {
    return this._stripeService.updateAccount(id);
  }

  @Post('create-account-link/:id')
  async createAccountLink(@Param('id') id: string): Promise<any> {
    return this._stripeService.createAccountLink(id);
  }

  @Get('get-account/:id')
  async getAccount(@Param('id') id: string): Promise<any> {
    return this._stripeService.connectAccount(id);
  }

  @Patch('account/:id/update-person/:personId')
  async updatePerson(
    @Param('id') id: string,
    @Param('personId') personId: string,
  ): Promise<any> {
    return this._stripeService.updatePerson(id, personId);
  }
}
