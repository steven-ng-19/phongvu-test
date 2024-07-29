import * as Zod from 'zod';

export const GalleryModel = Zod.object({
  id: Zod.string(),
  productId: Zod.string(),

  label: Zod.string(),
  url: Zod.string(),
  type: Zod.string(),
  order: Zod.number(),

  createdAt: Zod.date(),
  updatedAt: Zod.date(),
  deletedAt: Zod.date(),
});
