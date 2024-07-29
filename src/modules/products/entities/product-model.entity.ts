import * as Zod from 'zod';

export const ProductModel = Zod.object({
  id: Zod.string(),
  categoryId: Zod.string(),

  name: Zod.string(),
  slug: Zod.string(),
  price: Zod.number(),
  quantity: Zod.number(),
  description: Zod.string(),
  sku: Zod.string(),
  image: Zod.string(),
  discount: Zod.number(),

  createdAt: Zod.date(),
  updatedAt: Zod.date(),
  deletedAt: Zod.date(),
});
