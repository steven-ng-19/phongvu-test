import * as Zod from 'zod';

import { GalleryEntity } from '../entities/gallery.entity';
import { ProductEntity } from '../entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const CreateProductValidator = ProductEntity.pick({
  categoryId: true,
  name: true,
  price: true,
  quantity: true,
  description: true,
  sku: true,
  image: true,
  discount: true,
}).extend({
  galleries: Zod.array(
    GalleryEntity.pick({
      label: true,
      url: true,
      type: true,
      order: true,
    }),
  ),
});

export class CreateProductDto extends createZodDto(CreateProductValidator) {}
