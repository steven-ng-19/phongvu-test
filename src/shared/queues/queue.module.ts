import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { MINUTE, MINUTES_PER_HOUR } from 'src/common/constants';

import { AuthConsumer } from './consumers';
import { AuthModule } from 'src/modules/auth/auth.module';
import { BullModule } from '@nestjs/bullmq';
import { CONFIG_VAR } from 'src/config';
import { QUEUE_NAMES } from './constants';
import { QueueService } from './queue.service';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get(CONFIG_VAR.REDIS_HOST),
          port: config.get(CONFIG_VAR.REDIS_PORT),
          password: config.get(CONFIG_VAR.REDIS_PASSWORD),
          db: config.get(CONFIG_VAR.REDIS_DB_QUEUE),
        },
      }),
    }),
    BullModule.registerQueue({
      name: QUEUE_NAMES.AUTH_QUEUE,
    }),

    AuthModule,
  ],
  providers: [QueueService, AuthConsumer],
  exports: [QueueService],
})
export class QueueModule {}
