import * as Zod from 'zod';

import { DiscountModel } from './discount-model.entity';

export const DiscountShape = DiscountModel.shape;
export const DiscountKeys = DiscountModel.keyof().enum;

export const DiscountEntity = DiscountModel.extend({
  [DiscountKeys.id]: DiscountShape.id.uuid().trim(),

  [DiscountKeys.benefitId]: DiscountShape.benefitId.trim(),

  [DiscountKeys.percent]: DiscountShape.percent.default(0),
  [DiscountKeys.maxAmount]: DiscountShape.maxAmount.default(1),
  [DiscountKeys.flat]: DiscountShape.flat.nullable().optional(),
  [DiscountKeys.maxAmountPerOrder]: DiscountShape.maxAmountPerOrder,
  [DiscountKeys.deletedAt]: DiscountShape.deletedAt.nullable().optional(),
  [DiscountKeys.createdAt]: DiscountShape.createdAt,
  [DiscountKeys.updatedAt]: DiscountShape.updatedAt,
});
