import * as Zod from 'zod';

export const PromotionModel = Zod.object({
  id: Zod.string(),

  name: Zod.string(),
  description: Zod.string(),
  image: Zod.string(),
  endDate: Zod.string().datetime(),
  isDefault: Zod.boolean(),
  applyOn: Zod.string(),

  createdAt: Zod.date(),
  updatedAt: Zod.date(),
  deletedAt: Zod.date(),
});
