import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from '../services';
import {
  CategoryDto,
  CreateCategoryDto,
  CreateCategoryValidator,
  UpdateCategoryDto,
  UpdateCategoryValidator,
} from '../dtos';
import {
  CategoryPrimaryKey,
  CreateCategoryParams,
  UpdateCategoryParams,
} from '../types';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { CATEGORY_FILTER_FIELD } from '../constants';
import { BaseQueryParamsDto } from 'src/common/dtos';
import { ResponseService } from 'src/shared/response/response.service';
import { Request } from 'express';
import { generateSlug } from 'src/common/utils';
import { Prisma } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('admin/categories')
export class AdminCategoryController {
  constructor(private readonly _categoryService: CategoryService) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  async create(
    @Body()
    payload: CreateCategoryDto,
  ) {
    const data: CreateCategoryParams = {
      ...payload,
      slug: generateSlug(payload.name),
    };
    return await this._categoryService.createCategory(data);
  }

  @Patch(':id')
  @UsePipes(ZodValidationPipe)
  async update(
    @Param('id') id: CategoryPrimaryKey,
    @Body()
    payload: UpdateCategoryDto,
  ) {
    const data: UpdateCategoryParams = {
      ...payload,
      slug: payload.name && generateSlug(payload.name),
    };
    return await this._categoryService.update(id, data);
  }

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

  @Delete(':id')
  async delete(@Param('id') id: CategoryPrimaryKey) {
    return await this._categoryService.delete(id);
  }
}
