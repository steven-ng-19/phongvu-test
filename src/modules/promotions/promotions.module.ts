import {
  BENIFIT_MODEL,
  BenifitSchema,
  CONDITION_MODEL,
  ConditionSchema,
  PROMOTION_MODEL,
  PromotionSchema,
} from './models';

import { AdminPromotionController } from './controllers';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CONDITION_MODEL, schema: ConditionSchema },
      { name: BENIFIT_MODEL, schema: BenifitSchema },
      { name: PROMOTION_MODEL, schema: PromotionSchema },
    ]),
  ],
  controllers: [AdminPromotionController],
  providers: [PromotionService],
})
export class PromotionModule {}
