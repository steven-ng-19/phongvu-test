import {
  AddressFindByConditionParams,
  AddressFindByUniqueKeyParams,
  AddressFindManyByUniqueKeyParams,
  AddressPrimaryKey,
  CreateAddressParams,
  UpdateAddressParams,
} from '../types';

import { AddressDto } from '../dtos';
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

  findByKey(param: AddressFindByUniqueKeyParams): Prisma.AddressFindFirstArgs {
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

  findByCondition(
    param: AddressFindByConditionParams,
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

  delete(param: AddressPrimaryKey): Prisma.AddressDeleteArgs {
    return {
      where: {
        ...param,
      },
    };
  }

  findManyByKey(
    param: BaseQueryParamsDto<AddressDto>,
  ): Prisma.AddressFindManyArgs {
    const { findOptions } = param;
    console.log(findOptions);
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
