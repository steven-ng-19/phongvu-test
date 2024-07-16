import { ADDRESS_MODEL, AddressSchema, USER_MODEL, UserSchema } from './models';
import { AddressService, UsersService } from './services';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './controllers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODEL, schema: UserSchema },
      { name: ADDRESS_MODEL, schema: AddressSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AddressService],
  exports: [UsersService],
})
export class UsersModule {}
