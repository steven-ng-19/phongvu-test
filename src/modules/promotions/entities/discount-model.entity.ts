import * as Zod from 'zod';

export const DiscountModel = Zod.object({
  id: Zod.string(),
  benefitId: Zod.string(),

  percent: Zod.number(),
  maxAmount: Zod.number(),
  flat: Zod.number(),
  maxAmountPerOrder: Zod.number(),

  createdAt: Zod.date(),
  updatedAt: Zod.date(),
  deletedAt: Zod.date(),
});
