import { AddressModule } from '../addresses/address.module';
import { CartItemModule } from '../cart-items/cart-item.module';
import { Module } from '@nestjs/common';
import { OrderController } from './controllers';
import { OrderMapper } from './mappers';
import { OrderService } from './services';
import { ProductModule } from '../products/product.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [UserModule, ProductModule, AddressModule, CartItemModule],
  controllers: [OrderController],
  providers: [OrderService, OrderMapper],
  exports: [OrderService],
})
export class OrderModule {}
