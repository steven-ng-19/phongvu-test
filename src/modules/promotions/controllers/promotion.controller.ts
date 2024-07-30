import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ApiPaginateResponse } from 'src/shared/response/dtos';
import { FindPromotionDto } from '../dtos';
import { BaseQueryParamsDto } from 'src/common/dtos';
import { Request } from 'express';
import { ResponseService } from 'src/shared/response/response.service';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { PROMOTION_FILTER_FIELD } from '../constants';
import { PromotionService } from '../services';
import { Prisma } from '@prisma/client';

@Controller('promotions')
export class PromotionController {
  constructor(private readonly _promotionService: PromotionService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Req() req: Request,
    @Query(
      new DirectFilterPipe<any, Prisma.PromotionWhereInput>(
        [...PROMOTION_FILTER_FIELD],
        [],
        [{ createdAt: 'asc' }, { id: 'asc' }],
      ),
    )
    param: BaseQueryParamsDto<Prisma.PromotionWhereInput>,
  ): Promise<ApiPaginateResponse<Prisma.PromotionWhereInput>> {
    const { data, count } = await this._promotionService.findAll(param);
    const { findOptions, ...rest } = param;
    return ResponseService.paginateResponse({ data, count, query: rest, req });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this._promotionService.findOne({ id });
  }
}
