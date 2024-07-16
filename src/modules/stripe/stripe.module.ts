import { Module } from '@nestjs/common';
import { StripeController } from './controllers';
import { StripeService } from './services';

@Module({
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
