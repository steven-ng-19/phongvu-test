import { AddressDto, FindAddressDto } from '../dtos';
import {
  AddressFindByConditionParams,
  AddressFindByUniqueKeyParams,
  AddressFindManyByUniqueKeyParams,
  AddressPrimaryKey,
  CreateAddressParams,
  UpdateAddressParams,
} from '../types';

import { BaseQueryParamsDto } from 'src/common/dtos';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isArray } from 'src/common/utils';

@Injectable()
export class AddressMapper {
  constructor() {}

  create(param: CreateAddressParams): Prisma.AddressCreateArgs {
    const { userId, ...rest } = param;
    return {
      data: {
        ...rest,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    };
  }

  update(
    param: AddressPrimaryKey,
    data: UpdateAddressParams,
  ): Prisma.AddressUpdateArgs {
    return {
      where: {
        ...param,
      },
      data: data,
      include: {
        user: true,
      },
    };
  }

  findOne(
    param: AddressFindByUniqueKeyParams | AddressFindByConditionParams,
  ): Prisma.AddressFindFirstArgs {
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
        user: true,
      },
    };
  }

  findByPrimaryKey(param: AddressPrimaryKey): Prisma.AddressFindFirstArgs {
    return {
      where: {
        ...param,
        deletedAt: null,
      },
      include: {
        user: true,
      },
    };
  }

  delete(param: AddressPrimaryKey): Prisma.AddressDeleteArgs {
    return {
      where: {
        ...param,
      },
    };
  }

  findManyByKey(
    param: BaseQueryParamsDto<FindAddressDto>,
  ): Prisma.AddressFindManyArgs {
    const { findOptions } = param;
    findOptions.where = {
      ...findOptions.where,
      deletedAt: null,
    };
    return {
      ...findOptions,
      include: {
        user: true,
      },
    };
  }

  async findManyByCondition(
    param: AddressFindByConditionParams,
  ): Promise<Prisma.AddressFindManyArgs> {
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
        user: true,
      },
    };
  }

  count(param: AddressFindByConditionParams): Prisma.AddressCountArgs {
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
