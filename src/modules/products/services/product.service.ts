import { PRODUCT_ERRORS } from 'src/common/contents/errors/product.error';
import { BaseQueryParamsDto } from 'src/common/dtos';
import { ResponseSuccess } from 'src/common/types';
import { ResponseFindMany } from 'src/common/types/respone-find-many.type';
import { generateSlug } from 'src/common/utils';
import { CategoryService } from 'src/modules/categories/services';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { CreateProductDto, FindProductDto } from '../dtos';
import { ProductMapper } from '../mappers';
import {
  CreateProductParams,
  ProductFindByConditionParams,
  ProductFindByUniqueKeyParams,
  ProductFindManyPrimaryKeys,
  ProductManyFindByUniqueKeyParams,
  ProductPrimaryKey,
  UpdateProductParams,
} from '../types';

@Injectable()
export class ProductService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _mapper: ProductMapper,
    private readonly _categoryService: CategoryService,
  ) {}

  async createProduct(
    // NOTE: Write DTO form params type in service
    data: CreateProductParams,
  ): Promise<ResponseSuccess<Product>> {
    await this._categoryService.findOneByKey({
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

  updateProductMapper(
    param: ProductPrimaryKey,
    data: UpdateProductParams,
  ): Prisma.ProductUpdateArgs {
    return this._mapper.update(param, data);
  }

  async findOne(
    param: ProductFindByUniqueKeyParams | ProductFindByConditionParams,
  ): Promise<Product> {
    const mapperData = this._mapper.findOne(param);
    const product = await this._prismaService.product.findFirst(mapperData);
    if (!product) throw new BadRequestException(PRODUCT_ERRORS.NOT_FOUND);
    return product;
  }

  async checkProduct(
    param: ProductFindManyPrimaryKeys,
  ): Promise<{ products: Product[]; notFoundProduct: number }> {
    const mapperData = this._mapper.checkProduct(param);
    const products = await this._prismaService.product.findMany(mapperData);

    const foundProduct = products.map((product) => product.id);
    const notFoundProduct = param.ids.filter(
      (id) => !foundProduct.includes(id),
    );
    return {
      products,
      notFoundProduct: notFoundProduct.length,
    };
  }

  checkProductMapper(
    param: ProductFindManyPrimaryKeys,
  ): Prisma.ProductFindManyArgs {
    return this._mapper.checkProduct(param);
  }

  async findMany(
    param: BaseQueryParamsDto<Prisma.ProductWhereInput>,
  ): Promise<ResponseFindMany<Product>> {
    const mapperData = this._mapper.findMany(param);
    const count = await this._prismaService.product.count({
      where: mapperData.where,
    });
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
