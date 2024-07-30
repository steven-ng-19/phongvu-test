import {
  CategoryFindByConditionParams,
  CategoryFindByUniqueKeyParams,
  CategoryPrimaryKey,
  CreateCategoryParams,
  UpdateCategoryParams,
} from '../types';

import { BaseQueryParamsDto } from 'src/common/dtos';
import { CategoryDto } from '../dtos';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UpdateAddressParams } from 'src/modules/addresses/types';

@Injectable()
export class CategoryMapper {
  constructor(private readonly _prismaService: PrismaService) {}

  create(param: CreateCategoryParams): Prisma.CategoryCreateArgs {
    return {
      data: {
        ...param,
      },
    };
  }

  findOneByKey(
    param: CategoryFindByUniqueKeyParams,
  ): Prisma.CategoryFindFirstArgs {
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
        products: true,
      },
    };
  }

  findOneByCondition(
    param: CategoryFindByConditionParams,
  ): Prisma.CategoryFindFirstArgs {
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

  findMany(
    param: BaseQueryParamsDto<Prisma.CategoryWhereInput>,
  ): Prisma.CategoryFindManyArgs {
    const { findOptions } = param;
    findOptions.where = {
      ...findOptions.where,
      deletedAt: null,
    };
    return {
      ...findOptions,
    };
  }

  update(
    param: CategoryPrimaryKey,
    data: UpdateCategoryParams,
  ): Prisma.CategoryUpdateArgs {
    return {
      where: {
        ...param,
      },
      data: data,
    };
  }

  delete(param: CategoryPrimaryKey): Prisma.CategoryUpdateArgs {
    return {
      where: {
        ...param,
      },
      data: {
        isDeprecated: true,
      },
    };
  }

  count(param: CategoryFindByConditionParams): Prisma.CategoryCountArgs {
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
