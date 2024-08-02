import { Global, MiddlewareConsumer, Module } from '@nestjs/common';

import { OrderModule } from 'src/modules/orders/order.module';
import { StripeController } from './controllers';
import { StripeService } from './services';
import { UserModule } from 'src/modules/users/user.module';

@Global()
@Module({
  imports: [UserModule, OrderModule],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
