import { GiftModel } from './gift-model.entity';

export const GiftShape = GiftModel.shape;
export const GiftKeys = GiftModel.keyof().enum;

export const GiftEntity = GiftModel.extend({
  [GiftKeys.id]: GiftShape.id.uuid().trim(),

  [GiftKeys.benefitId]: GiftShape.benefitId.trim(),

  [GiftKeys.sku]: GiftShape.sku.trim(),
  [GiftKeys.name]: GiftShape.name.trim().min(2).max(100),
  [GiftKeys.image]: GiftShape.image.trim(),
  [GiftKeys.quantity]: GiftShape.quantity,
  [GiftKeys.maxQuantityPerOrder]: GiftShape.maxQuantityPerOrder,

  [GiftKeys.createdAt]: GiftShape.createdAt,
  [GiftKeys.updatedAt]: GiftShape.updatedAt,
  [GiftKeys.deletedAt]: GiftShape.deletedAt.nullable().optional(),
});
