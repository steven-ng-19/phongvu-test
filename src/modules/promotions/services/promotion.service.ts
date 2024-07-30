import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreatePromotionDto,
  FindPromotionDto,
  UpdatePromotionDto,
} from '../dtos';
import { Prisma, Promotion } from '@prisma/client';
import {
  PromotionFindByConditionParams,
  PromotionFindByUniqueKeyParams,
  PromotionPrimaryKey,
} from '../types';

import { BaseQueryParamsDto } from 'src/common/dtos';
import { PROMOTION_ERRRORS } from 'src/common/contents/errors/promotion.error';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { PromotionMapper } from '../mappers';
import { ResponseFindMany } from 'src/common/types/respone-find-many.type';
import { ResponseSuccess } from 'src/common/types';

@Injectable()
export class PromotionService {
  constructor(
    private readonly _mapper: PromotionMapper,
    private readonly _prismaService: PrismaService,
  ) {}

  async create(data: CreatePromotionDto): Promise<ResponseSuccess<Promotion>> {
    const mapperData = this._mapper.create(data);
    const promotion = await this._prismaService.promotion.create(mapperData);
    return {
      success: true,
      data: promotion,
    };
  }

  async update(
    param: PromotionPrimaryKey,
    data: UpdatePromotionDto,
  ): Promise<ResponseSuccess<Promotion>> {
    const mapperData = this._mapper.update(param, data);
    const promotion = await this._prismaService.promotion.update(mapperData);
    return {
      success: true,
      data: promotion,
    };
  }

  async findOne(
    param: PromotionFindByUniqueKeyParams | PromotionFindByConditionParams,
  ): Promise<Promotion> {
    const mapperData = this._mapper.findOne(param);
    const promotion = await this._prismaService.promotion.findFirst(mapperData);
    if (!promotion) throw new BadRequestException(PROMOTION_ERRRORS.NOT_FOUND);
    return promotion;
  }

  async findAll(
    param: BaseQueryParamsDto<Prisma.PromotionWhereInput>,
  ): Promise<ResponseFindMany<Promotion>> {
    const mapperData = this._mapper.findMany(param);
    const promotions = await this._prismaService.promotion.findMany(mapperData);
    const count = await this._prismaService.promotion.count({
      where: mapperData.where,
    });
    return {
      data: promotions,
      count,
    };
  }
}
