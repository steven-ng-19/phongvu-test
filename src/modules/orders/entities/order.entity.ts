import * as Zod from 'zod';

import { OrderModel } from './order-model.entity';

export const OrderShape = OrderModel.shape;
export const OrderKeys = OrderModel.keyof().enum;

export const OrderEntity = OrderModel.extend({
  [OrderKeys.id]: OrderShape.id.uuid().trim(),
  [OrderKeys.userId]: OrderShape.userId.uuid().trim(),

  [OrderKeys.status]: OrderShape.status,
  [OrderKeys.totalPrice]: OrderShape.totalPrice,
  [OrderKeys.paymentMethod]: OrderShape.paymentMethod,
  [OrderKeys.paymentId]: OrderShape.paymentId.nullable().optional(),
  [OrderKeys.paymentDetails]: OrderShape.paymentDetails.optional(),
  [OrderKeys.notes]: OrderShape.notes.nullable().optional(),

  [OrderKeys.createdAt]: OrderShape.createdAt,
  [OrderKeys.updatedAt]: OrderShape.updatedAt,
  [OrderKeys.deletedAt]: OrderShape.deletedAt.nullable().optional(),
});
