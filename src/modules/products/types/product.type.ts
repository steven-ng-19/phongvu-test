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

import { ProductDto } from '../dtos';

export const ProductUniqueKeys = Zod.union([
  Zod.object({ id: Zod.string() }),
  Zod.object({ categoryId: Zod.string() }),
]);

export const ProductManyUniqueKeys = Zod.union([
  Zod.object({ id: Zod.array(Zod.string()) }),
  Zod.object({ categoryId: Zod.array(Zod.string()) }),
]);

export type Product = ProductDto;

export type ProductPrimaryKey = Pick<Product, 'id'>;

export type CreateProductParams = EntityWithoutFields<
  Product,
  (typeof CREATE_PARAMS_WITHOUT_FIELDS)[number]
>;

const PRODUCT_WITHOUT_FIELDS = [
  ...CREATE_PARAMS_WITHOUT_FIELDS,
  'galleries',
] as const;
export type UpdateProductParams = OptionalNullableFields<
  EntityWithoutFields<Product, (typeof UPDATE_PARAMS_WITHOUT_FIELDS)[number]>
>;

export type ProductFindByUniqueKeyParams = Zod.infer<
  typeof ProductUniqueKeys
> & {
  excludes?: EntityNotInFilter<Product>;
};

export type ProductManyFindByUniqueKeyParams = Zod.infer<
  typeof ProductManyUniqueKeys
> & {
  excludes?: EntityNotInFilter<Product>;
};

export type ProductFindByConditionParams = EntityWithoutFields<
  Partial<Product> & {
    excludes?: EntityNotInFilter<Product>;
  },
  'galleries'
>;
