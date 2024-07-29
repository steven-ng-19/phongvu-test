import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Category,
  CategoryFindByConditionParams,
  CategoryFindByUniqueKeyParams,
  CategoryPrimaryKey,
  CreateCategoryParams,
  UpdateCategoryParams,
} from '../types';

import { BaseQueryParamsDto } from 'src/common/dtos';
import { CATEGORY_ERRORS } from 'src/common/contents/errors/category.error';
import { CategoryDto } from '../dtos';
import { CategoryMapper } from '../mappers';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ResponseFindMany } from 'src/common/types/respone-find-many.type';
import { ResponseSuccess } from 'src/common/types';

@Injectable()
export class CategoryService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _mapper: CategoryMapper,
  ) {}

  async createCategory(
    param: CreateCategoryParams,
  ): Promise<ResponseSuccess<Category>> {
    const existCategoryMapper = this._mapper.findOneByCondition({
      name: param.name,
    });
    const existCategory =
      await this._prismaService.category.findFirst(existCategoryMapper);
    if (existCategory) throw new BadRequestException(CATEGORY_ERRORS.EXIST);
    const mapperData = this._mapper.create(param);
    const category = await this._prismaService.category.create(mapperData);
    return {
      success: true,
      data: category,
    };
  }

  async findOneByKey(param: CategoryFindByUniqueKeyParams): Promise<Category> {
    const mapperData = this._mapper.findOneByKey(param);
    const category = await this._prismaService.category.findFirst(mapperData);
    if (!category) throw new BadRequestException(CATEGORY_ERRORS.NOT_FOUND);
    return category;
  }

  async findOneByCondition(
    param: CategoryFindByConditionParams,
  ): Promise<Category> {
    const mapperData = this._mapper.findOneByCondition(param);
    const category = await this._prismaService.category.findFirst(mapperData);
    if (!category) throw new BadRequestException(CATEGORY_ERRORS.NOT_FOUND);

    return category;
  }

  async findAll(
    param: BaseQueryParamsDto<CategoryDto>,
  ): Promise<ResponseFindMany<Category>> {
    const mapperData = this._mapper.findMany(param);
    const countData = this._mapper.count(param.findOptions.where);
    const count = await this._prismaService.category.count(countData);
    const categories = await this._prismaService.category.findMany(mapperData);
    return {
      count,
      data: categories,
    };
  }

  async update(
    param: CategoryPrimaryKey,
    data: UpdateCategoryParams,
  ): Promise<ResponseSuccess<Category>> {
    const existCategory = await this.findOneByKey(param);
    if (!existCategory)
      throw new BadRequestException(CATEGORY_ERRORS.NOT_FOUND);
    const mapperData = this._mapper.update(param, data);
    const category = await this._prismaService.category.update(mapperData);
    return {
      success: true,
      data: category,
    };
  }

  async delete(
    param: CategoryFindByUniqueKeyParams,
  ): Promise<ResponseSuccess<Category>> {
    const existCategory = await this.findOneByKey(param);
    if (!existCategory)
      throw new BadRequestException(CATEGORY_ERRORS.NOT_FOUND);
    const mapperData = this._mapper.delete(param);
    const category = await this._prismaService.category.update(mapperData);
    return {
      success: true,
    };
  }
}
