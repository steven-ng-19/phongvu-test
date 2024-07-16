import { Body, Controller, Post } from '@nestjs/common';

import { CreateStripeDto } from '../dto/create-stripe.dto';
import { CreateStripeSchema } from '../dto';
import { StripeService } from '../services/stripe.service';
import { ZodValidationPipe } from 'src/common/pipes';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  // @Post('customers')
  // async createCustomer(
  //   @Body(new ZodValidationPipe(CreateStripeSchema)) data: CreateStripeDto,
  // ) {
  //   return this.stripeService.createCustomer(data);
  // }
}
