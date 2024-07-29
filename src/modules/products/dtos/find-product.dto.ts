import { ProductValidator } from './product.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export const FindProductValidator = ProductValidator.omit({
  galleries: true,
});

export class FindProductDto extends createZodDto(FindProductValidator) {}
