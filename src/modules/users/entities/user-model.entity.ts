import * as Zod from 'zod';

import { Gender, UserRole } from 'src/common/enums';

export const roleValues = Object.values(UserRole) as [string, ...string[]];
export const genderValues = Object.values(Gender) as [string, ...string[]];
export const UserModel = Zod.object({
  id: Zod.string(),
  userName: Zod.string(),
  email: Zod.string().email(),
  phone: Zod.string(),
  password: Zod.string(),
  isEmailVerifiled: Zod.boolean(),
  isPhoneVerifiled: Zod.boolean(),
  firstName: Zod.string(),
  lastName: Zod.string(),
  avatar: Zod.string(),
  cover: Zod.string(),
  role: Zod.enum(roleValues),
  dob: Zod.date(),
  gender: Zod.enum(genderValues),
  emailVerificationToken: Zod.string(),
  resetPasswordToken: Zod.string(),
  customerId: Zod.string(),
  registrationTokens: Zod.string(),
  createdAt: Zod.date(),
  updatedAt: Zod.date(),
  deletedAt: Zod.date(),
});
