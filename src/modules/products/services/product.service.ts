import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto, FindProductDto } from '../dtos';
import {
  CreateProductParams,
  ProductFindByConditionParams,
  ProductFindByUniqueKeyParams,
  ProductPrimaryKey,
  UpdateProductParams,
} from '../types';

import { BaseQueryParamsDto } from 'src/common/dtos';
import { CategoryService } from 'src/modules/categories/services';
import { PRODUCT_ERRORS } from 'src/common/contents/errors/product.error';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { Product } from '@prisma/client';
import { ProductMapper } from '../mappers';
import { ResponseFindMany } from 'src/common/types/respone-find-many.type';
import { ResponseSuccess } from 'src/common/types';
import { generateSlug } from 'src/common/utils';

@Injectable()
export class ProductService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _mapper: ProductMapper,
    private readonly _categoryService: CategoryService,
  ) {}

  async createProduct(
    data: CreateProductParams,
  ): Promise<ResponseSuccess<Product>> {
    const category = await this._categoryService.findOneByKey({
      id: data.categoryId,
    });
    const existProductMapper = this._mapper.findOne({
      sku: data.sku,
    });
    const existProduct =
      await this._prismaService.product.findFirst(existProductMapper);
    if (existProduct) throw new BadRequestException(PRODUCT_ERRORS.EXIST);

    const mapperData = this._mapper.create(data);
    const product = await this._prismaService.product.create(mapperData);
    return {
      success: true,
      data: product,
    };
  }

  async updateProduct(
    param: ProductPrimaryKey,
    data: UpdateProductParams,
  ): Promise<ResponseSuccess<Product>> {
    const existProduct = await this.findOne(param);

    const beforeUpdateMapper = this._mapper.beforeUpdate(param);

    const beforUpdate =
      await this._prismaService.product.update(beforeUpdateMapper);

    const mapperData = this._mapper.update(param, data);
    const product = await this._prismaService.product.update(mapperData);
    return {
      success: true,
      data: product,
    };
  }

  async findOne(
    param: ProductFindByUniqueKeyParams | ProductFindByConditionParams,
  ): Promise<Product> {
    const mapperData = this._mapper.findOne(param);
    const product = await this._prismaService.product.findFirst(mapperData);
    if (!product) throw new BadRequestException(PRODUCT_ERRORS.NOT_FOUND);
    return product;
  }

  async findMany(
    param: BaseQueryParamsDto<FindProductDto>,
  ): Promise<ResponseFindMany<Product>> {
    const mapperData = this._mapper.findMany(param);
    const countData = this._mapper.count(param.findOptions.where);
    const count = await this._prismaService.product.count(countData);
    const products = await this._prismaService.product.findMany(mapperData);
    return {
      count,
      data: products,
    };
  }

  async deleteProduct(
    param: ProductPrimaryKey,
  ): Promise<ResponseSuccess<Product>> {
    const mapperData = this._mapper.delete(param);
    const product = await this._prismaService.product.update(mapperData);
    return {
      success: true,
    };
  }
}
