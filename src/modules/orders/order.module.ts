import { AddressModule } from '../addresses/address.module';
import { Module } from '@nestjs/common';
import { OrderController } from './controllers';
import { OrderMapper } from './mappers';
import { OrderService } from './services';
import { ProductModule } from '../products/product.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [UserModule, ProductModule, AddressModule],
  controllers: [OrderController],
  providers: [OrderService, OrderMapper],
  exports: [OrderService],
})
export class OrderModule {}
