import { CreateCategoryValidator } from './create-category.dto';
import { z } from 'zod';

export const UpdateCategoryValidator =
  CreateCategoryValidator.partial().strict();

export type UpdateCategoryDto = z.infer<typeof UpdateCategoryValidator>;
