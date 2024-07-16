import { CreateProductValidator } from './create-product.dto';
import { z } from 'zod';

export const UpdateProductValidator = CreateProductValidator.partial().strict();

export type UpdateProductDto = z.infer<typeof UpdateProductValidator>;
