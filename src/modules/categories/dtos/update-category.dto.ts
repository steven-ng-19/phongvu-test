import { CategoryEntity } from '../entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const UpdateCategoryValidator = CategoryEntity.pick({
  name: true,
  description: true,
  image: true,
}).partial();

export class UpdateCategoryDto extends createZodDto(UpdateCategoryValidator) {}
