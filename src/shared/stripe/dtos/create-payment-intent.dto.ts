import * as Zod from 'zod';

import { CreateOrderValidator } from 'src/modules/orders/dtos';
import { createZodDto } from '@anatine/zod-nestjs';

export const CreatePaymentIntentValidator = Zod.object({
  amount: Zod.number().nonnegative().min(1),
  currency: Zod.string(),
  metadata: Zod.object({}).optional(),
  customer: Zod.string().optional(),
  paymentMethodId: Zod.string().optional(),
  confirm: Zod.boolean().default(false),
  order: CreateOrderValidator,
});

export class CreatePaymentIntentDto extends createZodDto(
  CreatePaymentIntentValidator,
) {}
