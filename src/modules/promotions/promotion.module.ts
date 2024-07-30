import { AdminPromotionController, PromotionController } from './controllers';

import { Module } from '@nestjs/common';
import { PromotionMapper } from './mappers';
import { PromotionService } from './services';

@Module({
  controllers: [AdminPromotionController, PromotionController],
  providers: [PromotionMapper, PromotionService],
  exports: [PromotionService],
})
export class PromotionModule {}
