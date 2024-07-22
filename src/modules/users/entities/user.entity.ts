import { UserModel } from './user-model.entity';
import { parsePhoneNumber } from 'awesome-phonenumber';

export const UserShape = UserModel.shape;
export const UserKeys = UserModel.keyof().enum;

export const UserEntity = UserModel.extend({
  [UserKeys.id]: UserShape.id.uuid().trim(),
  [UserKeys.userName]: UserShape.userName.trim().length(50),
  [UserKeys.email]: UserShape.email.email().trim().toLowerCase(),
  [UserKeys.phone]: UserShape.phone.refine((phone) => {
    const phoneNumber = parsePhoneNumber(phone);
    return phoneNumber.valid ? phoneNumber.number : null;
  }),
  [UserKeys.password]: UserShape.password.min(8),
  [UserKeys.isEmailVerifiled]: UserShape.isEmailVerifiled.optional(),
  [UserKeys.isPhoneVerifiled]: UserShape.isPhoneVerifiled.optional(),
  [UserKeys.firstName]: UserShape.firstName.trim().min(2).max(50),
  [UserKeys.lastName]: UserShape.lastName
    .trim()
    .min(2)
    .max(50)
    .optional()
    .nullable(),
  [UserKeys.avatar]: UserShape.avatar.trim().optional().nullable(),
  [UserKeys.cover]: UserShape.cover.trim().nullable().optional(),
  [UserKeys.role]: UserShape.role,
  [UserKeys.dob]: UserShape.dob
    .refine((date) => date < new Date())
    .nullable()
    .optional(),
  [UserKeys.gender]: UserShape.gender,
  [UserKeys.emailVerificationToken]: UserShape.emailVerificationToken
    .trim()
    .nullable()
    .optional(),
  [UserKeys.resetPasswordToken]: UserShape.resetPasswordToken
    .trim()
    .nullable()
    .optional(),
  [UserKeys.customerId]: UserShape.customerId.trim().optional().nullable(),
  [UserKeys.registrationTokens]: UserShape.registrationTokens
    .nullable()
    .optional(),

  [UserKeys.createdAt]: UserShape.createdAt,
  [UserKeys.updatedAt]: UserShape.updatedAt.nullable().optional(),
  [UserKeys.deletedAt]: UserShape.deletedAt.nullable().optional(),
});
