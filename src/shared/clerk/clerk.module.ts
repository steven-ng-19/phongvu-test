import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

import { CONFIG_VAR } from 'src/config';
import { ClerkService } from './clerk.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [ClerkService],
  exports: [ClerkService],
})
export class ClerkModule {}
