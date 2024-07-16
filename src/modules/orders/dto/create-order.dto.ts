import { CreateAddressValidator } from 'src/modules/users/dto';
import { PaymentMethod } from 'src/common/enums';
import { parsePhoneNumber } from 'awesome-phonenumber';
import { z } from 'zod';

const paymentMethodEnumValues = Object.values(PaymentMethod) as [
  string,
  ...string[],
];
export const CreateOrderValidator = z
  .object({
    items: z.array(
      z.object({
        productId: z.string().trim(),
        quantity: z.number().min(1),
      }),
    ),
    paymentMethod: z
      .enum(paymentMethodEnumValues)
      .default(PaymentMethod.CREDIT_CARD),
    address: CreateAddressValidator,
    notes: z.string().trim().optional(),
    paymentMethodId: z.string().trim().optional(),
  })
  .strip();

export type CreateOrderDto = z.infer<typeof CreateOrderValidator>;
