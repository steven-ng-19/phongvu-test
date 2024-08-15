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
import { ProductService } from '../services';
import {
  CreateProductDto,
  CreateProductValidator,
  FindProductDto,
  UpdateProductDto,
  UpdateProductValidator,
} from '../dtos';
import { CreateProductParams, UpdateProductParams } from '../types';
import { generateSlug } from 'src/common/utils';
import { Request } from 'express';
import { BaseQueryParamsDto } from 'src/common/dtos';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { PRODUCT_FILTER_FIELD } from '../constants';
import { ResponseService } from 'src/shared/response/response.service';
import { Prisma } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('admin/products')
export class AdminProductController {
  constructor(private readonly _productService: ProductService) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  async createProduct(
    @Body()
    payload: CreateProductDto,
  ) {
    const data: CreateProductParams = {
      ...payload,
      slug: generateSlug(payload.name),
    };
    return await this._productService.createProduct(data);
  }

  @Patch(':id')
  @UsePipes(ZodValidationPipe)
  async updateProduct(
    @Param('id') id: string,
    @Body()
    payload: UpdateProductDto,
  ) {
    const data: UpdateProductParams = {
      ...payload,
      slug: payload.name && generateSlug(payload.name),
    };
    return await this._productService.updateProduct({ id }, data);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async findAll(
    @Req() req: Request,
    @Query(
      new DirectFilterPipe<any, Prisma.ProductWhereInput>(
        [...PRODUCT_FILTER_FIELD],
        [],
        [{ createdAt: 'asc' }, { id: 'asc' }],
      ),
    )
    query: BaseQueryParamsDto<Prisma.ProductWhereInput>,
  ) {
    const { count, data } = await this._productService.findMany(query);
    const { findOptions, ...rest } = query;
    return ResponseService.paginateResponse({ count, data, query: rest, req });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this._productService.findOne({ id });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this._productService.deleteProduct({ id });
  }
}
