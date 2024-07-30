import {
  BenefitEntity,
  ConditionEntity,
  DiscountEntity,
  GiftEntity,
  PromotionEntity,
} from '../entities';

import { createZodDto } from '@anatine/zod-nestjs';

export const PromotionValidator = PromotionEntity.extend({
  benefit: BenefitEntity.extend({
    gifts: GiftEntity.array(),
    discount: DiscountEntity,
  }),
  condition: ConditionEntity,
});

export class PromotionDto extends createZodDto(PromotionValidator) {}
