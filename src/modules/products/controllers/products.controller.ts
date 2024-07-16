import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../services';

import { ProductQueryParams } from 'src/shared/types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Query() query: ProductQueryParams) {
    return this.productsService.getProducts(query);
  }

  @Get(':productId')
  async getProduct(@Param('productId') productId: string) {
    return this.productsService.getProduct(productId);
  }
}
