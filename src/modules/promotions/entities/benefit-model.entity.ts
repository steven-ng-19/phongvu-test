import * as Zod from 'zod';

export const BenefitModel = Zod.object({
  id: Zod.string(),
  promotionId: Zod.string(),

  createdAt: Zod.date(),
  updatedAt: Zod.date(),
  deletedAt: Zod.date(),
});
