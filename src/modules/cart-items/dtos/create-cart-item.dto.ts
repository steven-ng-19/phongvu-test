import * as Zod from 'zod';

import { CartItemEntity } from '../entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const CreateCartItemValidator = CartItemEntity.pick({
  productId: true,
  quantity: true,
});

export class CreateCartItemDto extends createZodDto(CreateCartItemValidator) {}
