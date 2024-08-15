import { RepairPartnerEntity, RepairPartnerShape } from '../entities';

import { createZodDto } from '@anatine/zod-nestjs';
import { parsePhoneNumber } from 'awesome-phonenumber';

export const CreatePartnerValidator = RepairPartnerEntity.pick({
  userId: true,
  stripeAccountId: true,
  bussinessType: true,
  firstName: true,
  lastName: true,
  email: true,
  dob: true,
  phoneNumber: true,
}).extend({
  dob: RepairPartnerShape.dob
    .refine((dob) => new Date(dob) > new Date())
    .nullable()
    .optional(),
  phoneNumber: RepairPartnerShape.phoneNumber.refine((phone) => {
    const phoneNumber = parsePhoneNumber(phone);
    return phoneNumber.valid ? phoneNumber.number : null;
  }),
});

export class CreateRepairPartnerDto extends createZodDto(
  CreatePartnerValidator,
) {}
