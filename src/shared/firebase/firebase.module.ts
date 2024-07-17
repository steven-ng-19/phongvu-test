import { Global, Module } from '@nestjs/common';

import { FCMService } from './fcm.service';

@Global()
@Module({
  providers: [FCMService],
  exports: [FCMService],
})
export class FirebaseModule {}
