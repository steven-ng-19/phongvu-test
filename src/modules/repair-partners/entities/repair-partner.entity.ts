import { BussinessType, CompanyIndustry } from '../enums';

import { RepairPartnerModel } from './repair-partner-model.entity';

export const RepairPartnerShape = RepairPartnerModel.shape;
export const RepairPartnerKeys = RepairPartnerModel.keyof().enum;

export const RepairPartnerEntity = RepairPartnerModel.extend({
  [RepairPartnerKeys.id]: RepairPartnerShape.id.uuid().trim(),
  [RepairPartnerKeys.userId]: RepairPartnerShape.userId.uuid().trim(),
  [RepairPartnerKeys.stripeAccountId]: RepairPartnerShape.stripeAccountId,

  [RepairPartnerKeys.bussinessType]: RepairPartnerShape.bussinessType.default(
    BussinessType.INDIVIDUAL,
  ),
  [RepairPartnerKeys.companyIndustry]:
    RepairPartnerShape.companyIndustry.default(
      CompanyIndustry.CONSULTING_SERVICES,
    ),
  [RepairPartnerKeys.bussinessWebsite]: RepairPartnerShape.bussinessWebsite
    .trim()
    .url()
    .nullable()
    .optional(),
  [RepairPartnerKeys.firstName]: RepairPartnerShape.firstName
    .trim()
    .min(2)
    .max(50),
  [RepairPartnerKeys.lastName]: RepairPartnerShape.lastName
    .trim()
    .min(2)
    .max(50),
  [RepairPartnerKeys.email]: RepairPartnerShape.email
    .email()
    .trim()
    .toLowerCase(),
  [RepairPartnerKeys.dob]: RepairPartnerShape.dob.nullable().optional(),
  [RepairPartnerKeys.country]: RepairPartnerShape.country.nullable().optional(),
  [RepairPartnerKeys.addressLine1]: RepairPartnerShape.addressLine1
    .nullable()
    .optional(),
  [RepairPartnerKeys.addressLine2]: RepairPartnerShape.addressLine2
    .nullable()
    .optional(),
  [RepairPartnerKeys.city]: RepairPartnerShape.city.nullable().optional(),
  [RepairPartnerKeys.state]: RepairPartnerShape.state.nullable().optional(),
  [RepairPartnerKeys.postalCode]: RepairPartnerShape.postalCode
    .nullable()
    .optional(),
  [RepairPartnerKeys.phoneNumber]: RepairPartnerShape.phoneNumber
    .nullable()
    .optional(),
  [RepairPartnerKeys.bankAccountId]: RepairPartnerShape.bankAccountId
    .nullable()
    .optional(),

  [RepairPartnerKeys.createdAt]: RepairPartnerShape.createdAt,
  [RepairPartnerKeys.updatedAt]: RepairPartnerShape.updatedAt,
  [RepairPartnerKeys.deletedAt]: RepairPartnerShape.deletedAt
    .nullable()
    .optional(),
});
