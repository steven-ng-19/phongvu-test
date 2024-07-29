import * as Zod from 'zod';

export const CategoryModel = Zod.object({
  id: Zod.string(),
  name: Zod.string(),
  slug: Zod.string(),
  description: Zod.string(),
  image: Zod.string(),
  isDeprecated: Zod.boolean(),

  createdAt: Zod.date(),
  updatedAt: Zod.date(),
  deletedAt: Zod.date(),
});
