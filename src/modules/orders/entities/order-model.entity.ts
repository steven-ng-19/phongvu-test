import * as Zod from 'zod';

import { OrderStatus, PaymentMethod } from '../enums';

import { AddressEntity } from 'src/modules/addresses/entities';

export const OrderStatusValues = Object.values(OrderStatus) as [
  string,
  ...string[],
];
export const OrderPaymentMethodValues = Object.values(PaymentMethod) as [
  string,
  ...string[],
];

const literalSchema = Zod.union([
  Zod.string(),
  Zod.number(),
  Zod.boolean(),
  Zod.null(),
]);
type Literal = Zod.infer<typeof literalSchema>;
export type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: Zod.ZodType<Json> = Zod.lazy(() =>
  Zod.union([
    literalSchema,
    Zod.array(jsonSchema),
    Zod.record(jsonSchema),
    Zod.any(),
  ]),
);

export const OrderModel = Zod.object({
  id: Zod.string(),
  userId: Zod.string(),

  status: Zod.enum(OrderStatusValues),
  totalPrice: Zod.number(),
  paymentMethod: Zod.enum(OrderPaymentMethodValues),
  paymentId: Zod.string(),
  paymentDetails: Zod.string().and(jsonSchema),
  notes: Zod.string(),

  createdAt: Zod.date(),
  updatedAt: Zod.date(),
  deletedAt: Zod.date(),
});
