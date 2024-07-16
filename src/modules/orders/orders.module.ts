import { AdminOrderController, OrdersController } from './controllers';
import {
  ORDER_ITEM_MODEL,
  ORDER_MODEL,
  OrderItemSchema,
  OrderSchema,
} from './models';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './services/orders.service';
import { ProductsModule } from '../products/products.module';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ORDER_MODEL, schema: OrderSchema },
      { name: ORDER_ITEM_MODEL, schema: OrderItemSchema },
    ]),
    ProductsModule,
    StripeModule,
  ],
  controllers: [OrdersController, AdminOrderController],
  providers: [OrdersService],
})
export class OrdersModule {}
