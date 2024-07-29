import {
  CreateProductParams,
  ProductFindByConditionParams,
  ProductFindByUniqueKeyParams,
  ProductPrimaryKey,
  UpdateProductParams,
} from '../types';
import { FindProductDto, ProductDto } from '../dtos';

import { BaseQueryParamsDto } from 'src/common/dtos';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductMapper {
  create(param: CreateProductParams): Prisma.ProductCreateArgs {
    const { galleries, ...rest } = param;
    return {
      data: {
        ...rest,
        galleries: galleries && {
          createMany: {
            data: galleries,
          },
        },
      },
      include: {
        galleries: true,
      },
    };
  }

  beforeUpdate(param: ProductPrimaryKey): Prisma.ProductUpdateArgs {
    return {
      where: param,
      data: {
        galleries: {
          deleteMany: {
            productId: param.id,
          },
        },
      },
    };
  }

  update(
    param: ProductPrimaryKey,
    data: UpdateProductParams,
  ): Prisma.ProductUpdateArgs {
    const { galleries, ...rest } = data;
    return {
      where: {
        ...param,
      },
      data: {
        ...rest,
        galleries: galleries && {
          createMany: {
            data: galleries,
          },
        },
      },
      include: {
        galleries: true,
      },
    };
  }

  findOne(
    param: ProductFindByUniqueKeyParams | ProductFindByConditionParams,
  ): Prisma.ProductFindFirstArgs {
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
    param: BaseQueryParamsDto<FindProductDto>,
  ): Prisma.ProductFindManyArgs {
    const { findOptions } = param;
    return {
      ...findOptions,
      include: {
        galleries: true,
      },
    };
  }

  delete(param: ProductPrimaryKey): Prisma.ProductUpdateArgs {
    return {
      where: {
        ...param,
      },
      data: {
        deletedAt: new Date(),
      },
    };
  }

  count(param: ProductFindByConditionParams): Prisma.ProductCountArgs {
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
