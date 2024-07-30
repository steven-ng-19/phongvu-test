import { BenefitModel } from './benefit-model.entity';

export const BenefitShape = BenefitModel.shape;
export const BenefitKeys = BenefitModel.keyof().enum;

export const BenefitEntity = BenefitModel.extend({
  [BenefitKeys.id]: BenefitShape.id.uuid().trim(),

  [BenefitKeys.promotionId]: BenefitShape.promotionId.trim(),

  [BenefitKeys.createdAt]: BenefitShape.createdAt,
  [BenefitKeys.updatedAt]: BenefitShape.updatedAt.nullable().optional(),
  [BenefitKeys.deletedAt]: BenefitShape.deletedAt.nullable().optional(),
});
