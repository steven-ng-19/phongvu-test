import * as Zod from 'zod';

import {
  CREATE_PARAMS_WITHOUT_FIELDS,
  UPDATE_PARAMS_WITHOUT_FIELDS,
} from 'src/common/constants/param-without-field.constant';
import {
  EntityNotInFilter,
  EntityWithoutFields,
  OptionalNullableFields,
} from 'src/common/types';

import { CategoryDto } from '../dtos';

export const CategoryUniqueKeySchema = Zod.object({
  id: Zod.string(),
});

export const CategoryManyUniqueKeysSchema = Zod.object({
  id: Zod.array(Zod.string()),
});

export type Category = CategoryDto;

export type CategoryPrimaryKey = Pick<Category, 'id'>;

const CATEGORY_WITHOUT_FIELDS = [
  ...CREATE_PARAMS_WITHOUT_FIELDS,
  'isDeprecated',
] as const;

export type CreateCategoryParams = OptionalNullableFields<
  EntityWithoutFields<Category, (typeof CATEGORY_WITHOUT_FIELDS)[number]>
>;

export type UpdateCategoryParams = Partial<
  EntityWithoutFields<Category, (typeof UPDATE_PARAMS_WITHOUT_FIELDS)[number]>
>;

export type CategoryFindByUniqueKeyParams = Zod.infer<
  typeof CategoryUniqueKeySchema
> & { excludes?: EntityNotInFilter<Category> };

export type CategoryFindManyByUniqueKeyParams = Zod.infer<
  typeof CategoryManyUniqueKeysSchema
> & { excludes?: EntityNotInFilter<Category> };

export type CategoryFindByConditionParams = Partial<Category> & {
  excludes?: EntityNotInFilter<Category>;
};
