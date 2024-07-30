import {
  CreatePromotionParams,
  PromotionFindByConditionParams,
  PromotionFindByUniqueKeyParams,
  PromotionPrimaryKey,
  UpdatePromotionParams,
} from '../types';

import { BaseQueryParamsDto } from 'src/common/dtos';
import { FindPromotionDto } from '../dtos';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class PromotionMapper {
  create(data: CreatePromotionParams): Prisma.PromotionCreateArgs {
    const { benefit, condition, ...rest } = data;
    const { discount, gifts, ...benefitData } = benefit;
    return {
      data: {
        ...rest,
        benefit: {
          create: {
            ...benefitData,
            discount: {
              create: discount,
            },
            gifts: {
              createMany: {
                data: gifts,
              },
            },
          },
        },
        condition: {
          create: condition,
        },
      },
      include: {
        benefit: {
          include: {
            discount: true,
            gifts: true,
          },
        },
        condition: true,
      },
    };
  }

  update(
    param: PromotionPrimaryKey,
    data: UpdatePromotionParams,
  ): Prisma.PromotionUpdateArgs {
    const { benefit, condition, ...rest } = data;
    return {
      where: param,
      data: {
        ...rest,
        benefit: benefit && {
          update: {
            ...benefit,
            discount: {
              update: benefit.discount,
            },
            gifts: {
              deleteMany: {},
              createMany: {
                data: benefit.gifts,
              },
            },
          },
        },
        condition: condition && {
          update: condition,
        },
      },
    };
  }

  findOne(
    param: PromotionFindByUniqueKeyParams | PromotionFindByConditionParams,
  ): Prisma.PromotionFindFirstArgs {
    const { excludes = {}, ...rest } = param;
    return {
      where: {
        ...rest,
        ...Object.fromEntries(
          Object.entries(excludes).map(([key, value]) => [
            key,
            { notIn: value },
          ]),
        ),
        deletedAt: null,
      },
      include: {
        benefit: {
          include: {
            discount: true,
            gifts: true,
          },
        },
        condition: true,
      },
    };
  }

  findMany(
    param: BaseQueryParamsDto<Prisma.PromotionWhereInput>,
  ): Prisma.PromotionFindManyArgs {
    const { findOptions } = param;
    findOptions.where = {
      ...findOptions.where,
      deletedAt: null,
    };
    return {
      ...findOptions,
      include: {
        benefit: {
          include: {
            discount: true,
            gifts: true,
          },
        },
        condition: true,
      },
    };
  }

  delete(param: PromotionPrimaryKey): Prisma.PromotionUpdateArgs {
    return {
      where: param,
      data: {
        deletedAt: new Date(),
      },
    };
  }

  count(param: PromotionFindByConditionParams): Prisma.PromotionCountArgs {
    const { excludes = {}, ...rest } = param;
    return {
      where: {
        ...rest,
        ...Object.fromEntries(
          Object.entries(excludes).map(([key, value]) => [
            key,
            { notIn: value },
          ]),
        ),
        deletedAt: null,
      },
    };
  }
}
