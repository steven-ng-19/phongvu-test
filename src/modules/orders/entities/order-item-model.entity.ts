import * as Zod from 'zod';

export const OrderItemModel = Zod.object({
  orderId: Zod.string(),
  productId: Zod.string(),

  quantity: Zod.number(),
  discount: Zod.number(),
  totalPrice: Zod.number(),
  totalPriceWithDiscount: Zod.number(),

  createdAt: Zod.date(),
  updatedAt: Zod.date(),
  deletedAt: Zod.date(),
});
