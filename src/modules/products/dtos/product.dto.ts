import * as Zod from 'zod';

import { GalleryEntity } from '../entities/gallery.entity';
import { ProductEntity } from '../entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const ProductValidator = ProductEntity.extend({
  galleries: Zod.array(
    GalleryEntity.pick({
      label: true,
      url: true,
      type: true,
      order: true,
    }),
  ),
});

export class ProductDto extends createZodDto(ProductValidator) {}
