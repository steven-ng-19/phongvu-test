import { Global, Module } from '@nestjs/common';

import { SendGridService } from './sendGrid.service';

@Global()
@Module({
  providers: [SendGridService],
  exports: [SendGridService],
})
export class SendGridModule {}
