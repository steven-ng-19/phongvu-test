import {
  CreateOrderParams,
  OrderFindByConditionParams,
  OrderFindByUniqueKeyParams,
  OrderPrimaryKey,
  UpdateOrderParams,
} from '../types';

import { BaseQueryParamsDto } from 'src/common/dtos';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderMapper {
  create(data: CreateOrderParams): Prisma.OrderCreateArgs {
    const { addressData, orderItems, ...rest } = data;
    return {
      data: {
        ...rest,
        addressData: addressData,
        orderItems: {
          createMany: {
            data: orderItems,
          },
        },
      },
      include: {
        orderItems: true,
      },
    };
  }

  update(
    param: OrderPrimaryKey,
    data: UpdateOrderParams,
  ): Prisma.OrderUpdateArgs {
    return {
      where: param,
      data: data,
      include: {
        orderItems: true,
      },
    };
  }

  findOne(
    param: OrderFindByUniqueKeyParams | OrderFindByConditionParams,
  ): Prisma.OrderFindManyArgs {
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
    };
  }

  findByPrimaryKey(param: OrderPrimaryKey): Prisma.OrderFindManyArgs {
    return {
      where: {
        id: param.id,
      },
      include: {
        orderItems: true,
      },
    };
  }

  findAll(
    param: BaseQueryParamsDto<Prisma.OrderWhereInput>,
  ): Prisma.OrderFindManyArgs {
    const { findOptions, ...rest } = param;
    findOptions.where = {
      ...findOptions.where,
      deletedAt: null,
    };
    return {
      ...findOptions,
      include: {
        orderItems: true,
      },
    };
  }
}
