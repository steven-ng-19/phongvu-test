import * as Zod from 'zod';

import { OrderEntity, OrderItemEntity } from '../entities';

import { AddressEntity } from 'src/modules/addresses/entities';
import { ProductEntity } from 'src/modules/products/entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const CreateOrderValidator = OrderEntity.pick({
  status: true,
  paymentMethod: true,
  paymentId: true,
  paymentDetails: true,
  notes: true,
}).extend({
  addressId: Zod.string().uuid().trim(),
  orderItems: Zod.array(
    OrderItemEntity.pick({
      productId: true,
      quantity: true,
    }),
  ),
});

export class CreateOrderDto extends createZodDto(CreateOrderValidator) {}
