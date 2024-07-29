import { AdminCategoryController, CategoryController } from './controllers';

import { CategoryMapper } from './mappers';
import { CategoryService } from './services';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AdminCategoryController, CategoryController],
  providers: [CategoryMapper, CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
