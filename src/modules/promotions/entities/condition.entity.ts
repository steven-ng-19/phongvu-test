import { ConditionModel } from './condition-model.entity';

export const ConditionShape = ConditionModel.shape;
export const ConditionKeys = ConditionModel.keyof().enum;

export const ConditionEntity = ConditionModel.extend({
  [ConditionKeys.id]: ConditionShape.id.uuid().trim(),

  [ConditionKeys.promotionId]: ConditionShape.promotionId.trim(),
  [ConditionKeys.orderValueMin]: ConditionShape.orderValueMin.default(1),
  [ConditionKeys.orderValueMax]: ConditionShape.orderValueMax.default(1),
  [ConditionKeys.minQuantity]: ConditionShape.minQuantity.default(1),

  [ConditionKeys.createdAt]: ConditionShape.createdAt,
  [ConditionKeys.updatedAt]: ConditionShape.updatedAt.nullable().optional(),
  [ConditionKeys.deletedAt]: ConditionShape.deletedAt.nullable().optional(),
});
