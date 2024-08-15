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

import { RepairPartnerDto } from '../dtos';

export const RepairPartnerUniqueKeys = Zod.union([
  Zod.object({ id: Zod.string().uuid().trim() }),
  Zod.object({ userId: Zod.string().uuid().trim() }),
  Zod.object({ stripeAccountId: Zod.string().trim() }),
]);

export const RepairPartnerManyUniqueKeys = Zod.union([
  Zod.array(Zod.object({ id: Zod.string().uuid().trim() })),
  Zod.array(Zod.object({ userId: Zod.string().uuid().trim() })),
  Zod.array(Zod.object({ stripeAccountId: Zod.string().trim() })),
]);

export type RepairPartner = RepairPartnerDto;

export type RepairPartnerPrimaryKey = Pick<RepairPartnerDto, 'id'>;

export type CreateRepairPartnerParams = OptionalNullableFields<
  EntityWithoutFields<
    RepairPartner,
    (typeof CREATE_PARAMS_WITHOUT_FIELDS)[number]
  >
>;

export type UpdateRepairPartnerParams = Partial<
  EntityWithoutFields<
    RepairPartner,
    (typeof UPDATE_PARAMS_WITHOUT_FIELDS)[number]
  >
>;

export type FindRepairPartnerByUniqueKeyParams = Zod.infer<
  typeof RepairPartnerUniqueKeys
> & { excludes?: EntityNotInFilter<RepairPartner> };

export type FindManyRepairPartnerByUniqueKeyParams = Zod.infer<
  typeof RepairPartnerManyUniqueKeys
> & { excludes?: EntityNotInFilter<RepairPartner> };

export type FindRepairPartnerByConditionParams = Partial<RepairPartner> & {
  excludes?: EntityNotInFilter<RepairPartner>;
};
