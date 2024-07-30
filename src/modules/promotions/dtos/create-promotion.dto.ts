import {
  BenefitEntity,
  ConditionEntity,
  DiscountEntity,
  GiftEntity,
  PromotionEntity,
} from '../entities';

import { createZodDto } from '@anatine/zod-nestjs';

export const CreatePromotionValidator = PromotionEntity.pick({
  name: true,
  description: true,
  image: true,
  endDate: true,
  isDefault: true,
  applyOn: true,
}).extend({
  benefit: BenefitEntity.partial().extend({
    gifts: GiftEntity.pick({
      name: true,
      image: true,
      sku: true,
      maxQuantityPerOrder: true,
      quantity: true,
    }).array(),
    discount: DiscountEntity.pick({
      flat: true,
      maxAmount: true,
      maxAmountPerOrder: true,
      percent: true,
    }),
  }),
  condition: ConditionEntity.pick({
    minQuantity: true,
    orderValueMax: true,
    orderValueMin: true,
  }),
});

export class CreatePromotionDto extends createZodDto(
  CreatePromotionValidator,
) {}
