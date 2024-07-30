import * as Zod from 'zod';

import { AddressDto, FindAddressDto } from '../dtos';
import {
  CREATE_PARAMS_WITHOUT_FIELDS,
  UPDATE_PARAMS_WITHOUT_FIELDS,
} from 'src/common/constants/param-without-field.constant';
import {
  EntityNotInFilter,
  EntityWithoutFields,
  OptionalNullableFields,
} from 'src/common/types';

export const AddressUniqueKeys = Zod.union([
  Zod.object({ id: Zod.string(), clerkId: Zod.string() }),
  Zod.object({ userId: Zod.string() }),
]);

export const AddressManyUniqueKeys = Zod.union([
  Zod.object({ id: Zod.array(Zod.string()) }),
  Zod.object({ userId: Zod.array(Zod.string()) }),
]);

const CREATE_ADDRESS_WITHOUT_FIELDS = [
  ...CREATE_PARAMS_WITHOUT_FIELDS,
  'user',
] as const;
const UPDATE_ADDRESS_WITHOUT_FIELDS = [
  ...UPDATE_PARAMS_WITHOUT_FIELDS,
  'user',
] as const;

export type Address = AddressDto;
export type FindAddress = FindAddressDto;

export type AddressPrimaryKey = Pick<Address, 'id'>;
export type CreateAddressParams = EntityWithoutFields<
  Address,
  (typeof CREATE_ADDRESS_WITHOUT_FIELDS)[number]
>;

export type UpdateAddressParams = OptionalNullableFields<
  EntityWithoutFields<Address, (typeof UPDATE_ADDRESS_WITHOUT_FIELDS)[number]>
>;

export type AddressFindByUniqueKeyParams = Zod.infer<
  typeof AddressUniqueKeys
> & {
  excludes?: EntityNotInFilter<Address>;
};

export type AddressFindManyByUniqueKeyParams = Zod.infer<
  typeof AddressManyUniqueKeys
> & {
  excludes?: EntityNotInFilter<Address>;
};

export type AddressFindByConditionParams = Partial<FindAddress> & {
  excludes?: EntityNotInFilter<Address>;
};
