import * as Zod from 'zod';

import {
  EntityNotInFilter,
  EntityWithoutFields,
  OptionalNullableFields,
} from 'src/common/types';

import { CREATE_PARAMS_WITHOUT_FIELDS } from 'src/common/constants/param-without-field.constant';
import { CartItemDto } from '../dtos';

export const CartItemUniqueKeys = Zod.union([
  Zod.object({ id: Zod.string(), userId: Zod.string().optional() }),
  Zod.object({ userId: Zod.string() }),
  Zod.object({ productId: Zod.string() }),
]);

export const CartItemManyUniqueKeys = Zod.union([
  Zod.object({
    id: Zod.array(Zod.string()),
    userId: Zod.array(Zod.string()).optional(),
  }),
  Zod.object({ userId: Zod.array(Zod.string()) }),
  Zod.object({ productId: Zod.array(Zod.string()) }),
]);

export type CartItem = CartItemDto;

export type CartItemPrimaryKey = Pick<CartItem, 'id'>;
export type CreateCartItemParams = OptionalNullableFields<
  EntityWithoutFields<CartItem, (typeof CREATE_PARAMS_WITHOUT_FIELDS)[number]>
>;

export type UpdateCartItemParams = Partial<
  EntityWithoutFields<CartItem, (typeof CREATE_PARAMS_WITHOUT_FIELDS)[number]>
>;

export type CartItemFindByUniqueKey = Zod.infer<typeof CartItemUniqueKeys> & {
  excludes?: EntityNotInFilter<CartItem>;
};

export type CartItemFindByCondition = Partial<CartItemDto> & {
  excludes?: EntityNotInFilter<CartItem>;
};
