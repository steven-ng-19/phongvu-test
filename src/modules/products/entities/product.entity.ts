import { ProductModel } from './product-model.entity';

export const ProductShape = ProductModel.shape;
export const ProductKeys = ProductModel.keyof().enum;

export const ProductEntity = ProductModel.extend({
  [ProductKeys.id]: ProductShape.id.uuid().trim(),
  [ProductKeys.categoryId]: ProductShape.categoryId.uuid().trim(),
  [ProductKeys.name]: ProductShape.name.trim().min(3).max(200),
  [ProductKeys.slug]: ProductShape.slug.trim(),
  [ProductKeys.price]: ProductShape.price.min(1),
  [ProductKeys.quantity]: ProductShape.quantity.min(0),
  [ProductKeys.description]: ProductShape.description.trim().min(10),
  [ProductKeys.sku]: ProductShape.sku.trim(),
  [ProductKeys.image]: ProductShape.image.trim().url(),
  [ProductKeys.discount]: ProductShape.discount.optional().nullable(),

  [ProductKeys.createdAt]: ProductShape.createdAt,
  [ProductKeys.updatedAt]: ProductShape.updatedAt.nullable().optional(),
  [ProductKeys.deletedAt]: ProductShape.deletedAt.nullable().optional(),
});
