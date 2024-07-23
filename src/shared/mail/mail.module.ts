import { Global, Module } from '@nestjs/common';

import { MailService } from './services';

@Global()
@Module({
  imports: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
