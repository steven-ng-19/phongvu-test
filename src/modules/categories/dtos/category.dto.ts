import { CategoryEntity } from '../entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const CategoryValidator = CategoryEntity;

export class CategoryDto extends createZodDto(CategoryValidator) {}
