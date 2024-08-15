import {
  RepairPartnerEntity,
  RepairPartnerModel,
  RepairPartnerShape,
} from '../entities';

import { createZodDto } from '@anatine/zod-nestjs';
import { parsePhoneNumber } from 'awesome-phonenumber';

export const UpdateRepairPartnerValidator = RepairPartnerEntity.pick({
  bussinessWebsite: true,
  firstName: true,
  lastName: true,
  dob: true,
  country: true,
  addressLine1: true,
  addressLine2: true,
  city: true,
  state: true,
  phoneNumber: true,
  companyIndustry: true,
  bankAccountId: true,
})
  .extend({
    dob: RepairPartnerShape.dob
      .refine((dob) => new Date(dob) > new Date())
      .nullable()
      .optional(),
    phoneNumber: RepairPartnerShape.phoneNumber.refine((phone) => {
      const phoneNumber = parsePhoneNumber(phone);
      return phoneNumber.valid ? phoneNumber.number : null;
    }),
  })
  .partial();

export class UpdateRepairPartnerDto extends createZodDto(
  UpdateRepairPartnerValidator,
) {}
