import { AdminUserController, UserController } from './controllers';

import { Module } from '@nestjs/common';
import { UserMapper } from './mappers';
import { UserService } from './services';

@Module({
  controllers: [UserController, AdminUserController],
  providers: [UserService, UserMapper],
  exports: [UserService],
})
export class UserModule {}
