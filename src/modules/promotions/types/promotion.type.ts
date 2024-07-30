import * as Zod from 'zod';

import {
  CreatePromotionDto,
  FindPromotionDto,
  PromotionDto,
  UpdatePromotionDto,
} from '../dtos';
import {
  EntityNotInFilter,
  EntityWithoutFields,
  OptionalNullableFields,
} from 'src/common/types';

import { CREATE_PARAMS_WITHOUT_FIELDS } from 'src/common/constants/param-without-field.constant';

export const PromotionUniqueKeys = Zod.object({
  id: Zod.string(),
});

export const PromotionManyUniqueKeys = Zod.array(PromotionUniqueKeys);

export type Promotion = PromotionDto;

export type FindPromotion = FindPromotionDto;
export type PromotionPrimaryKey = Pick<Promotion, 'id'>;

export type CreatePromotionParams = CreatePromotionDto;

export type UpdatePromotionParams = UpdatePromotionDto;

export type PromotionFindByUniqueKeyParams = Zod.infer<
  typeof PromotionUniqueKeys
> & {
  excludes?: EntityNotInFilter<Promotion>;
};

export type PromotionFindManyByUniqueKeyParams = Zod.infer<
  typeof PromotionManyUniqueKeys
> & {
  excludes?: EntityNotInFilter<Promotion>;
};

export type PromotionFindByConditionParams = Partial<FindPromotion> & {
  excludes?: EntityNotInFilter<FindPromotion>;
};
