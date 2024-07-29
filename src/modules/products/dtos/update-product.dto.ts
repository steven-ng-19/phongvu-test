import { CreateProductValidator } from './create-product.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export const UpdateProductValidator = CreateProductValidator.partial();

export class UpdateProductDto extends createZodDto(UpdateProductValidator) {}
