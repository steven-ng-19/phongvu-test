import { AdminAuthController, AuthController } from './controllers';
import { JwtStrategy, LocalStrategy } from './strategies';

import { AuthService } from './services';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController, AdminAuthController],
  providers: [AuthService, JwtService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
