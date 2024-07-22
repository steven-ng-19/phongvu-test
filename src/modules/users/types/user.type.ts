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
import { UserDto, UserRelatedDto } from '../dtos';

export const UserUniqueKeySchema = Zod.union([
  Zod.object({ id: Zod.string() }),
  Zod.object({ email: Zod.string() }),
  Zod.object({ customerId: Zod.string() }),
]);

export const UserManyUniqueKeysSchema = Zod.union([
  Zod.object({ id: Zod.array(Zod.string()) }),
  Zod.object({ email: Zod.array(Zod.string()) }),
  Zod.object({ customerId: Zod.array(Zod.string()) }),
]);

export type User = UserDto;

export type UserRelation = UserRelatedDto;

export type UserPrimaryKey = Pick<User, 'id'>;

export type CreateUserParams = EntityWithoutFields<
  User,
  (typeof CREATE_PARAMS_WITHOUT_FIELDS)[number]
>;

export type UpdateUserParams = OptionalNullableFields<
  EntityWithoutFields<User, (typeof UPDATE_PARAMS_WITHOUT_FIELDS)[number]>
>;

export type UserFindByUniqueKeyParams = Zod.infer<
  typeof UserUniqueKeySchema
> & { excludes?: EntityNotInFilter<User> };

export type UserFindManyByUniqueKeyParams = Zod.infer<
  typeof UserManyUniqueKeysSchema
> & { excludes?: EntityNotInFilter<User> };

export type UserFindByConditionParams = Partial<User> & {
  excludes?: EntityNotInFilter<User>;
};
