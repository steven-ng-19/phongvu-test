import * as Zod from 'zod';

import { CategoryModel } from './category-model.entity';

export const CategoryShape = CategoryModel.shape;
export const CategoryKey = CategoryModel.keyof().enum;

export const CategoryEntity = CategoryModel.extend({
  [CategoryKey.id]: CategoryShape.id.uuid().trim(),
  [CategoryKey.name]: CategoryShape.name.trim().min(3).max(200),
  [CategoryKey.slug]: CategoryShape.slug.trim(),
  [CategoryKey.description]: CategoryShape.description.trim().min(3).max(200),
  [CategoryKey.image]: CategoryShape.image.trim().url(),
  [CategoryKey.isDeprecated]: CategoryShape.isDeprecated.default(false),

  [CategoryKey.createdAt]: CategoryShape.createdAt,
  [CategoryKey.updatedAt]: CategoryShape.updatedAt.nullable().optional(),
  [CategoryKey.deletedAt]: CategoryShape.deletedAt.nullable().optional(),
});
