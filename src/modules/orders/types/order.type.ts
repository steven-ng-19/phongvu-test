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

import { OrderDto } from '../dtos';

export const OrderUniqueKeys = Zod.union([
  Zod.object({ id: Zod.string() }),
  Zod.object({ userId: Zod.string() }),
]);

export const OrderManyUniqueKeys = Zod.union([
  Zod.object({ id: Zod.string().array() }),
  Zod.object({ userId: Zod.string().array() }),
]);

export type Order = OrderDto;

export type OrderPrimaryKey = Pick<Order, 'id'>;

const UPDATE_ORDER_PARAM_WITHOUT_FIELDS = [
  ...UPDATE_PARAMS_WITHOUT_FIELDS,
  'orderItems',
] as const;

const FIND_PARAM_WITHOUT_FIELDS = [
  'addressData',
  'orderItems',
  'paymentDetails',
] as const;

export type CreateOrderParams = EntityWithoutFields<
  Order,
  (typeof CREATE_PARAMS_WITHOUT_FIELDS)[number]
>;

export type UpdateOrderParams = OptionalNullableFields<
  EntityWithoutFields<
    OrderDto,
    (typeof UPDATE_ORDER_PARAM_WITHOUT_FIELDS)[number]
  >
>;

export type OrderFindByUniqueKeyParams = Zod.infer<typeof OrderUniqueKeys> & {
  excludes?: EntityNotInFilter<Order>;
};

export type OrderFindManyByUniqueKeyParams = Zod.infer<
  typeof OrderManyUniqueKeys
> & {
  excludes?: EntityNotInFilter<Order>;
};

export type OrderFindByConditionParams = EntityWithoutFields<
  Partial<Order> & {
    excludes?: EntityNotInFilter<Order>;
  },
  (typeof FIND_PARAM_WITHOUT_FIELDS)[number]
>;
