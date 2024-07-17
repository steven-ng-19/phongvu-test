import { WISH_MODEL, WishSchema } from './models/wish.schema';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from '../products/products.module';
import { WishlistController } from './controllers';
import { WishlistService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WISH_MODEL, schema: WishSchema }]),
    ProductsModule,
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
