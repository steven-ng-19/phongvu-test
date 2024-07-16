import { CATEGORY_MODEL, CategorySchema } from './models';

import { CategoriesController } from './controllers';
import { CategoriesService } from './services';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CATEGORY_MODEL, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
