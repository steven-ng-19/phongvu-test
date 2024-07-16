import { StripeSchema } from '../entities/stripe.entity';
import { z } from 'zod';

export const CreateStripeSchema = StripeSchema.extend({
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be string',
    })
    .min(6)
    .max(14)
    .trim(),
  address: z
    .string({
      required_error: 'Address is required',
      invalid_type_error: 'Address must be string',
    })
    .trim(),
}).required();

export type CreateStripeDto = z.infer<typeof CreateStripeSchema>;
