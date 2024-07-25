import * as Zod from 'zod';

import {
  EntityNotInFilter,
  EntityWithoutFields,
  OptionalNullableFields,
} from 'src/common/types';

import { AddressDto } from '../dtos';
import { CREATE_PARAMS_WITHOUT_FIELDS } from 'src/common/constants/param-without-field.constant';

export const AddressUniqueKeys = Zod.union([
  Zod.object({ id: Zod.string() }),
  Zod.object({ userId: Zod.string() }),
]);

export const AddressManyUniqueKeys = Zod.union([
  Zod.object({ id: Zod.array(Zod.string()) }),
  Zod.object({ userId: Zod.array(Zod.string()) }),
]);

export type Address = AddressDto;
export type AddressPrimaryKey = Pick<Address, 'id'>;
export type CreateAddressParams = EntityWithoutFields<
  Address,
  (typeof CREATE_PARAMS_WITHOUT_FIELDS)[number]
>;

export type UpdateAddressParams = OptionalNullableFields<
  EntityWithoutFields<Address, (typeof CREATE_PARAMS_WITHOUT_FIELDS)[number]>
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

export type AddressFindByConditionParams = Partial<Address> & {
  excludes?: EntityNotInFilter<Address>;
};
