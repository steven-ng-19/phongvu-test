import * as Zod from 'zod';

import { OrderEntity, OrderItemEntity } from '../entities';

import { AddressEntity } from 'src/modules/addresses/entities';
import { ProductEntity } from 'src/modules/products/entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const OrderValidator = OrderEntity.extend({
  addressData: AddressEntity.partial(),
  orderItems: Zod.array(
    OrderItemEntity.extend({
      productData: ProductEntity.partial(),
    }).partial({
      orderId: true,
      updatedAt: true,
      createdAt: true,
      deletedAt: true,
    }),
  ),
});

export class OrderDto extends createZodDto(OrderValidator) {}
