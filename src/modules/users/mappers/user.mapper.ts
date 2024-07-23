import {
  CreateUserParams,
  UserFindByConditionParams,
  UserFindByUniqueKeyParams,
  UserPrimaryKey,
} from '../types';

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from '../dtos';

@Injectable()
export class UserMapper {
  constructor() {}

  create(param: CreateUserParams): Prisma.UserCreateArgs {
    return {
      data: {
        ...param,
      },
      include: {
        addresses: true,
      },
    };
  }

  findByKey(param: UserFindByUniqueKeyParams): Prisma.UserFindFirstArgs {
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
      select: {
        id: true,
        avatar: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        userName: true,
        cover: true,
        dob: true,
        gender: true,
        customerId: true,
        phone: true,
        isEmailVerifiled: true,
        isPhoneVerifiled: true,
        emailVerificationToken: true,
        resetPasswordToken: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        card: true,
        addresses: {
          select: {
            id: true,
            address: true,
            city: true,
            country: true,
            district: true,
            fullName: true,
            isDefault: true,
            phone: true,
            ward: true,
            createdAt: true,
          },
        },
      },
    };
  }

  findByCondition(param: UserFindByConditionParams): Prisma.UserFindFirstArgs {
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
      select: {
        id: true,
        avatar: true,
        email: true,
        firstName: true,
        lastName: true,
        userName: true,
      },
    };
  }

  update(param: UserPrimaryKey, data: UpdateUserDto): Prisma.UserUpdateArgs {
    return {
      where: {
        ...param,
      },
      data: {
        ...data,
      },
      select: {
        id: true,
        avatar: true,
        email: true,
        firstName: true,
        lastName: true,
        userName: true,
        cover: true,
        dob: true,
        gender: true,
        customerId: true,
        phone: true,
        isEmailVerifiled: true,
        isPhoneVerifiled: true,
        emailVerificationToken: true,
        resetPasswordToken: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        card: true,
        addresses: {
          select: {
            id: true,
            address: true,
            city: true,
            country: true,
            district: true,
            fullName: true,
            isDefault: true,
            phone: true,
            ward: true,
            createdAt: true,
          },
        },
      },
    };
  }
}
