import { AdminProductController, ProductsController } from './controllers';
import {
  GALLERY_MODEL,
  GallerySchema,
  PRODUCT_MODEL,
  ProductSchema,
} from './models';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PRODUCT_MODEL, schema: ProductSchema },
      { name: GALLERY_MODEL, schema: GallerySchema },
    ]),
  ],
  controllers: [ProductsController, AdminProductController],
  providers: [ProductsService],
  exports: [ProductsService, MongooseModule],
})
export class ProductsModule {}
