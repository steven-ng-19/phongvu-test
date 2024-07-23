import {
  AdminJwtAccessStrategy,
  LocalStrategy,
  UserJwtAccessStrategy,
} from './strategies';

import { AuthController } from './controllers';
import { AuthService } from './services';
import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';

@Module({
  imports: [UserModule],
  providers: [
    AuthService,
    LocalStrategy,
    AdminJwtAccessStrategy,
    UserJwtAccessStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
