import { Module } from '@nestjs/common';
import { RepairPartnerMapper } from './mappers';
import { RepairPartnerService } from './services/repair-partner.service';

@Module({
  controllers: [],
  providers: [RepairPartnerMapper, RepairPartnerService],
  exports: [RepairPartnerService],
})
export class RepairPartnerModule {}
