import * as Zod from 'zod';

import { OrderItemModel } from './order-item-model.entity';

export const OrderItemShape = OrderItemModel.shape;
export const OrderItemKeys = OrderItemModel.keyof().enum;

export const OrderItemEntity = OrderItemModel.extend({
  [OrderItemKeys.orderId]: OrderItemShape.orderId.uuid().trim(),
  [OrderItemKeys.productId]: OrderItemShape.productId.uuid().trim(),

  [OrderItemKeys.quantity]: OrderItemShape.quantity
    .min(1)
    .nonnegative()
    .default(1),

  [OrderItemKeys.discount]: OrderItemShape.discount
    .min(0)
    .nonnegative()
    .default(0)
    .optional(),
  [OrderItemKeys.totalPrice]: OrderItemShape.totalPrice.min(0).default(0),
  [OrderItemKeys.totalPriceWithDiscount]: OrderItemShape.totalPriceWithDiscount
    .min(0)
    .default(0)
    .optional(),

  [OrderItemKeys.createdAt]: OrderItemShape.createdAt,
  [OrderItemKeys.updatedAt]: OrderItemShape.updatedAt.nullable().optional(),
  [OrderItemKeys.deletedAt]: OrderItemShape.deletedAt.nullable().optional(),
});
