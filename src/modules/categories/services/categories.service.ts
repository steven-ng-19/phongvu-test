import { Injectable } from '@nestjs/common';
import { CATEGORY_MODEL } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDocument } from '../entities';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(CATEGORY_MODEL) private categoryModel: Model<CategoryDocument>,
  ) {}

  async createCategory<T>(data: CreateCategoryDto): Promise<T> {
    return this.categoryModel.create(data) as T;
  }

  async updateCategory<T>(id: string, data: UpdateCategoryDto): Promise<T> {
    return this.categoryModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean() as T;
  }
}
