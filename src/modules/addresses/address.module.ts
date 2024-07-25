import { AddressController } from './controllers';
import { AddressMapper } from './mappers';
import { AddressService } from './services';
import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';

@Module({
  imports: [UserModule],
  controllers: [AddressController],
  providers: [AddressMapper, AddressService],
  exports: [AddressService],
})
export class AddressModule {}
