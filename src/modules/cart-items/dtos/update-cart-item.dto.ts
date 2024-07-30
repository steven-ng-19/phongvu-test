import { CartItemEntity } from '../entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const UpdateCartItemValidator = CartItemEntity.pick({
  quantity: true,
}).partial();

export class UpdateCartItemDto extends createZodDto(UpdateCartItemValidator) {}
