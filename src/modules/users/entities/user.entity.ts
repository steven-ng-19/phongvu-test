import { UserModel } from './user-model.entity';
import { parsePhoneNumber } from 'awesome-phonenumber';

export const UserShape = UserModel.shape;
export const UserKeys = UserModel.keyof().enum;

export const UserEntity = UserModel.extend({
  [UserKeys.id]: UserShape.id.uuid().trim(),
  [UserKeys.clerkId]: UserShape.clerkId.trim(),
  [UserKeys.userName]: UserShape.userName.trim().max(50),
  [UserKeys.email]: UserShape.email.email().trim().toLowerCase(),
  [UserKeys.phone]: UserShape.phone.refine((phone) => {
    const phoneNumber = parsePhoneNumber(phone);
    return phoneNumber.valid ? phoneNumber.number : null;
  }),

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
    .refine((date) => new Date(date) < new Date())
    .nullable()
    .optional(),
  [UserKeys.gender]: UserShape.gender,

  [UserKeys.customerId]: UserShape.customerId.trim().optional().nullable(),
  [UserKeys.createdAt]: UserShape.createdAt,
  [UserKeys.updatedAt]: UserShape.updatedAt.nullable().optional(),
  [UserKeys.deletedAt]: UserShape.deletedAt.nullable().optional(),
});
