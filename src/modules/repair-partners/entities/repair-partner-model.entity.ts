import * as Zod from 'zod';

import { BussinessType, CompanyIndustry } from '../enums';

export const RepairPartnerModel = Zod.object({
  id: Zod.string(),
  userId: Zod.string(),
  stripeAccountId: Zod.string(),

  bussinessType: Zod.nativeEnum(BussinessType),
  companyIndustry: Zod.nativeEnum(CompanyIndustry),
  bussinessWebsite: Zod.string(),
  firstName: Zod.string(),
  lastName: Zod.string(),
  email: Zod.string(),
  dob: Zod.string().datetime(),
  country: Zod.string(),
  addressLine1: Zod.string(),
  addressLine2: Zod.string(),
  city: Zod.string(),
  state: Zod.string(),
  postalCode: Zod.string(),
  phoneNumber: Zod.string(),
  bankAccountId: Zod.string(),

  createdAt: Zod.date(),
  updatedAt: Zod.date(),
  deletedAt: Zod.date(),
});
