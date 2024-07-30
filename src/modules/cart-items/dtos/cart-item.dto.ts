import { CartItemEntity } from '../entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const CartItemValidator = CartItemEntity;

export class CartItemDto extends createZodDto(CartItemValidator) {}
