import { Global, Module } from '@nestjs/common';

import { StripeService } from './services';

@Global()
@Module({
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
