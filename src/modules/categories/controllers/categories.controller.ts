import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import {
  CreateCategoryDto,
  CreateCategoryValidator,
} from '../dto/create-category.dto';
import { Category } from '../models';
import { CategoriesService } from '../services';
import { ZodValidationPipe } from 'src/common/pipes';
import { UpdateCategoryDto, UpdateCategoryValidator } from '../dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(CreateCategoryValidator))
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.createCategory<Category>(createCategoryDto);
  }

  // @Get()
  // findAll() {
  //   return this.categoriesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.categoriesService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCategoryValidator))
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory<Category>(
      id,
      updateCategoryDto,
    );
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.categoriesService.remove(+id);
  // }
}
