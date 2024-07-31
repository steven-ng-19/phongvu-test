import { CartItemModel } from './cart-item-model.entity';

export const CartItemShape = CartItemModel.shape;
export const CartItemKeys = CartItemModel.keyof().enum;

export const CartItemEntity = CartItemModel.extend({
  [CartItemKeys.id]: CartItemShape.id.uuid().trim(),
  [CartItemKeys.userId]: CartItemShape.userId.uuid().trim(),
  [CartItemKeys.productId]: CartItemShape.productId.uuid().trim(),
  [CartItemKeys.quantity]: CartItemShape.quantity
    .min(1)
    .nonnegative()
    .default(1),
  [CartItemKeys.createdAt]: CartItemShape.createdAt,
  [CartItemKeys.updatedAt]: CartItemShape.updatedAt,
  [CartItemKeys.deletedAt]: CartItemShape.deletedAt.nullable().optional(),
});
