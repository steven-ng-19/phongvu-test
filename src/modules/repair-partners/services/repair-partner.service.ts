import { BadRequestException, Injectable } from '@nestjs/common';
import { BussinessType, CompanyIndustry } from '../enums';
import {
  FindRepairPartnerByConditionParams,
  FindRepairPartnerByUniqueKeyParams,
  RepairPartner,
  RepairPartnerPrimaryKey,
  UpdateRepairPartnerParams,
} from '../types';

import { CreateRepairPartnerDto } from '../dtos';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { RepairPartnerMapper } from '../mappers';
import { ResponseSuccess } from 'src/common/types';

@Injectable()
export class RepairPartnerService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _repairPartnerMapper: RepairPartnerMapper,
  ) {}

  async create(
    data: CreateRepairPartnerDto,
  ): Promise<ResponseSuccess<RepairPartner>> {
    const mapperData = this._repairPartnerMapper.create({
      ...data,
      companyIndustry: CompanyIndustry.CONSULTING_SERVICES,
    });

    const repairPartner =
      await this._prismaService.repairPartner.create(mapperData);
    return {
      success: true,
    };
  }

  async update(
    params: RepairPartnerPrimaryKey,
    data: UpdateRepairPartnerParams,
  ): Promise<ResponseSuccess<RepairPartner>> {
    const mapperData = this._repairPartnerMapper.update(params, data);
    const repairPartner =
      await this._prismaService.repairPartner.update(mapperData);
    return {
      success: true,
    };
  }

  async findOneByKey(
    params: FindRepairPartnerByUniqueKeyParams,
  ): Promise<RepairPartner> {
    const mapperData = this._repairPartnerMapper.findOneByUniqueKey(params);
    const repairPartner =
      await this._prismaService.repairPartner.findFirst(mapperData);
    if (!repairPartner)
      throw new BadRequestException('Repair partner not found');
    return {
      ...repairPartner,
      bussinessType: BussinessType[repairPartner.bussinessType],
      companyIndustry: CompanyIndustry[repairPartner.companyIndustry],
      dob: repairPartner?.dob ? repairPartner.dob.toDateString() : null,
    };
  }

  async findByConditions(
    params: FindRepairPartnerByConditionParams,
  ): Promise<RepairPartner> {
    const mapperData = this._repairPartnerMapper.findByConditions(params);
    const repairPartner =
      await this._prismaService.repairPartner.findFirst(mapperData);
    if (!repairPartner)
      throw new BadRequestException('Repair partner not found');
    return {
      ...repairPartner,
      bussinessType: BussinessType[repairPartner.bussinessType],
      companyIndustry: CompanyIndustry[repairPartner.companyIndustry],
      dob: repairPartner?.dob ? repairPartner.dob.toDateString() : null,
    };
  }
}
