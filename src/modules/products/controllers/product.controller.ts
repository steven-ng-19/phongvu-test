import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ProductService } from '../services';
import { Request } from 'express';
import { FindProductDto } from '../dtos';
import { PRODUCT_FILTER_FIELD } from '../constants';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { BaseQueryParamsDto } from 'src/common/dtos';
import { ResponseService } from 'src/shared/response/response.service';

@Controller('products')
export class ProductController {
  constructor(private readonly _productService: ProductService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async findAll(
    @Req() req: Request,
    @Query(
      new DirectFilterPipe<any, FindProductDto>(
        [...PRODUCT_FILTER_FIELD],
        [],
        [{ createdAt: 'asc' }, { id: 'asc' }],
      ),
    )
    query: BaseQueryParamsDto<FindProductDto>,
  ) {
    const { count, data } = await this._productService.findMany(query);
    const { findOptions, ...rest } = query;
    return ResponseService.paginateResponse({ count, data, query: rest, req });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this._productService.findOne({ id });
  }
}
