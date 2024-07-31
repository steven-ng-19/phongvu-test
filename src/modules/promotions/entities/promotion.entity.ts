import * as Zod from 'zod';

import { PromotionModel } from './promotion-model.entity';

export const PromotionShape = PromotionModel.shape;
export const PromotionKeys = PromotionModel.keyof().enum;

export const PromotionEntity = PromotionModel.extend({
  [PromotionKeys.id]: PromotionShape.id.uuid().trim(),

  [PromotionKeys.name]: PromotionShape.name.trim().min(2).max(100),
  [PromotionKeys.description]: PromotionShape.description.trim().min(10),
  [PromotionKeys.image]: PromotionShape.image.trim().url(),
  [PromotionKeys.endDate]: PromotionShape.endDate.refine(
    (val) => new Date(val) > new Date(),
  ),

  [PromotionKeys.isDefault]: PromotionShape.isDefault.default(false),
  [PromotionKeys.applyOn]: PromotionShape.applyOn.nullable().optional(),

  [PromotionKeys.createdAt]: PromotionShape.createdAt,
  [PromotionKeys.updatedAt]: PromotionShape.updatedAt,
  [PromotionKeys.deletedAt]: PromotionShape.deletedAt.nullable().optional(),
});
