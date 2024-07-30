import {
  CartItemFindByCondition,
  CartItemUniqueKeys,
} from './../types/cart-item.type';
import {
  CartItemFindByUniqueKey,
  CartItemPrimaryKey,
  CreateCartItemParams,
  UpdateCartItemParams,
} from '../types';

import { BaseQueryParamsDto } from 'src/common/dtos';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CartItemMapper {
  create(data: CreateCartItemParams): Prisma.CartItemCreateArgs {
    return {
      data,
      include: {
        product: true,
      },
    };
  }

  update(
    param: CartItemPrimaryKey,
    data: UpdateCartItemParams,
  ): Prisma.CartItemUpdateArgs {
    return {
      where: param,
      data,
      include: {
        product: true,
      },
    };
  }

  findOne(
    param: CartItemFindByUniqueKey | CartItemFindByCondition,
  ): Prisma.CartItemFindFirstArgs {
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
      },
      include: {
        product: true,
      },
    };
  }

  findAll(
    param: BaseQueryParamsDto<Prisma.CartItemWhereInput>,
  ): Prisma.CartItemFindManyArgs {
    const { findOptions, ...rest } = param;
    findOptions.where = {
      ...findOptions.where,
      deletedAt: null,
    };
    return {
      ...findOptions,
      include: {
        product: true,
      },
    };
  }

  delete(param: CartItemPrimaryKey): Prisma.CartItemUpdateArgs {
    return {
      where: param,
      data: {
        deletedAt: new Date(),
      },
    };
  }
}
