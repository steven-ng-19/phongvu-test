import {
  CreateRepairPartnerParams,
  FindRepairPartnerByConditionParams,
  FindRepairPartnerByUniqueKeyParams,
  RepairPartnerPrimaryKey,
  UpdateRepairPartnerParams,
} from '../types';

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isArray } from 'src/common/utils';

@Injectable()
export class RepairPartnerMapper {
  create(data: CreateRepairPartnerParams): Prisma.RepairPartnerCreateArgs {
    return {
      data,
    };
  }

  update(
    params: RepairPartnerPrimaryKey,
    data: UpdateRepairPartnerParams,
  ): Prisma.RepairPartnerUpdateArgs {
    return {
      where: params,
      data,
    };
  }

  findOneByUniqueKey(
    params: FindRepairPartnerByUniqueKeyParams,
  ): Prisma.RepairPartnerFindFirstArgs {
    const { excludes = {}, ...rest } = params;
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
        user: {
          select: {
            id: true,
            avatar: true,
          },
        },
      },
    };
  }

  findManyByUniqueKey(
    params: FindRepairPartnerByUniqueKeyParams,
  ): Prisma.RepairPartnerFindManyArgs {
    const { excludes = {}, ...rest } = params;
    return {
      where: {
        ...Object.fromEntries(
          Object.entries(rest).map(([key, value]) =>
            isArray(value) ? [key, { in: value }] : [key, value],
          ),
        ),
        ...Object.fromEntries(
          Object.entries(excludes).map(([key, value]) => [
            key,
            { notIn: value },
          ]),
        ),
      },
      include: {
        user: {
          select: {
            id: true,
            avatar: true,
          },
        },
      },
    };
  }

  findByConditions(
    params: FindRepairPartnerByConditionParams,
  ): Prisma.RepairPartnerFindFirstArgs {
    const { excludes = {}, ...rest } = params;
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

  delete(param: RepairPartnerPrimaryKey): Prisma.RepairPartnerUpdateArgs {
    return {
      where: param,
      data: {
        deletedAt: new Date(),
        repairServices: {
          updateMany: {
            where: {
              repairPartnerId: param.id,
            },
            data: {
              deletedAt: new Date(),
            },
          },
        },
      },
    };
  }
}
