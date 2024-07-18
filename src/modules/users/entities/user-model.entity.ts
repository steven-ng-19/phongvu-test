import { Gender, UserRole } from 'src/common/enums';

import { z } from 'zod';

export const roleValues = Object.values(UserRole) as [string, ...string[]];
export const genderValues = Object.values(Gender) as [string, ...string[]];
export const UserModel = z.object({
  id: z.string(),
  userName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  password: z.string(),
  isEmailVerifiled: z.boolean(),
  isPhoneVerifiled: z.boolean(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string(),
  cover: z.string(),
  role: z.enum(roleValues),
  dob: z.date(),
  gender: z.enum(genderValues),
  emailVerificationToken: z.string(),
  resetPasswordToken: z.string(),
  customerId: z.string(),
  registrationTokens: z.array(z.string()),
});
