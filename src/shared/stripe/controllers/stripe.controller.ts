import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  RawBody,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StripeService } from '../services';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CONFIG_VAR } from 'src/config';
import { ClerkAuthGuard } from 'src/modules/auth/guards';
import { RequestUser } from 'src/common/decorators';
import { ClerkPayload } from 'src/modules/auth/types';
import { ZodValidationPipe } from 'src/common/pipes';
import { CreatePaymentIntentDto, CreatePaymentIntentValidator } from '../dtos';
import { ResponseStripe } from '../types';
import { OrderService } from 'src/modules/orders/services';
import { OrderStatus } from 'src/modules/orders/enums';
import { OK } from 'zod';

@Controller('stripe')
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

      default:
        console.log(event);
    }
    return 'success';
  }

  @Post('create-payment-intent')
  @UseGuards(ClerkAuthGuard)
  async createPaymentIntent(
    @RequestUser() user: ClerkPayload,
    @Body(new ZodValidationPipe(CreatePaymentIntentValidator))
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
}
