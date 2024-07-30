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
export const OrderModel = Zod.object({
  id: Zod.string(),
  userId: Zod.string(),

  status: Zod.enum(OrderStatusValues),
  totalPrice: Zod.number(),
  paymentMethod: Zod.enum(OrderPaymentMethodValues),
  paymentId: Zod.string(),
  paymentDetails: Zod.object({}),
  notes: Zod.string(),

  createdAt: Zod.date(),
  updatedAt: Zod.date(),
  deletedAt: Zod.date(),
});
