import * as Zod from 'zod';

export const GiftModel = Zod.object({
  id: Zod.string(),
  benefitId: Zod.string(),

  sku: Zod.string(),
  name: Zod.string(),
  image: Zod.string(),
  quantity: Zod.number(),
  maxQuantityPerOrder: Zod.number(),

  createdAt: Zod.date(),
  updatedAt: Zod.date(),
  deletedAt: Zod.date(),
});
