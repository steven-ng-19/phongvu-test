import {
  AdminClerkStategy,
  LocalStrategy,
  UserJwtAccessStrategy,
} from './strategies';
import { AuthQueueService, AuthService } from './services';

import { AuthController } from './controllers';
import { ClerkModule } from 'src/shared/clerk/clerk.module';
import { ClerkStategy } from './strategies/clerk.strategy';
import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';

@Module({
  imports: [UserModule],
  providers: [
    AuthService,
    AuthQueueService,
    LocalStrategy,
    AdminClerkStategy,
    UserJwtAccessStrategy,
    ClerkStategy,
    ClerkModule,
  ],
  controllers: [AuthController],
  exports: [AuthService, AuthQueueService],
})
export class AuthModule {}
