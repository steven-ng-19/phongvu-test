import { Module } from '@nestjs/common';
import { UserMapper } from './mappers';
import { UserService } from './services';

@Module({
  providers: [UserService, UserMapper],
  exports: [UserService],
})
export class UserModule {}
