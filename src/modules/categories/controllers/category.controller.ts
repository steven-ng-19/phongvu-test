import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from '../services';
import { Request } from 'express';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { CATEGORY_FILTER_FIELD } from '../constants';
import { BaseQueryParamsDto } from 'src/common/dtos';
import { CategoryDto } from '../dtos';
import { ResponseService } from 'src/shared/response/response.service';
import { Prisma } from '@prisma/client';

@Controller('categories')
export class CategoryController {
  constructor(private readonly _categoryService: CategoryService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async findAll(
    @Req() req: Request,
    @Query(
      new DirectFilterPipe<any, Prisma.CategoryWhereInput>(
        [...CATEGORY_FILTER_FIELD],
        [],
        [{ createdAt: 'asc' }, { id: 'asc' }],
      ),
    )
    query: BaseQueryParamsDto<Prisma.CategoryWhereInput>,
  ) {
    const { data, count } = await this._categoryService.findAll(query);
    const { findOptions, ...rest } = query;
    return ResponseService.paginateResponse({
      count,
      data,
      query: rest,
      req,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this._categoryService.findOneByKey({ id });
  }
}
