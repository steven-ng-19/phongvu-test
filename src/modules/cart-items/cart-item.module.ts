import { CartItemController } from './controllers';
import { CartItemMapper } from './mappers';
import { CartItemService } from './services';
import { Module } from '@nestjs/common';
import { ProductModule } from '../products/product.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [UserModule, ProductModule],
  controllers: [CartItemController],
  providers: [CartItemService, CartItemMapper],
  exports: [CartItemService],
})
export class CartItemModule {}
