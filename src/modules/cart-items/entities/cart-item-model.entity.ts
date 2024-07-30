import * as Zod from 'zod';

export const CartItemModel = Zod.object({
  id: Zod.string(),
  userId: Zod.string(),
  productId: Zod.string(),

  quantity: Zod.number(),

  createdAt: Zod.date(),
  updatedAt: Zod.date(),
  deletedAt: Zod.date(),
});
