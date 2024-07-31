import { GalleryModel } from './gallery-model.entity';

export const GalleryShape = GalleryModel.shape;
export const GalleryKeys = GalleryModel.keyof().enum;

export const GalleryEntity = GalleryModel.extend({
  [GalleryKeys.id]: GalleryShape.id.uuid().trim(),
  [GalleryKeys.productId]: GalleryShape.productId.uuid().trim(),
  [GalleryKeys.label]: GalleryShape.label.trim().min(2).max(255),
  [GalleryKeys.url]: GalleryShape.url.trim().url(),
  [GalleryKeys.type]: GalleryShape.type.trim().min(2).max(15).optional(),
  [GalleryKeys.order]: GalleryShape.order.min(0).max(15).default(0),

  [GalleryKeys.createdAt]: GalleryShape.createdAt,
  [GalleryKeys.updatedAt]: GalleryShape.updatedAt,
  [GalleryKeys.deletedAt]: GalleryShape.deletedAt.nullable().optional(),
});
