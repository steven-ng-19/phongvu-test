import { z } from 'zod';

export const CheckoutOrderValidator = z
  .object({
    paymentMethodId: z
      .string({
        required_error: 'Payment method ID is required',
        invalid_type_error: 'Payment method ID must be string',
      })
      .trim(),
  })
  .strip();

export type CheckoutOrderDto = z.infer<typeof CheckoutOrderValidator>;
