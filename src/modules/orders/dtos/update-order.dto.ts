import { OrderEntity } from '../entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const UpdateOrderValidator = OrderEntity.pick({
  status: true,
});

export class UpdateOrderDto extends createZodDto(UpdateOrderValidator) {}
