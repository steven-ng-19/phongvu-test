import * as Zod from 'zod';

import { Gender, UserRole } from 'src/common/enums';

export const roleValues = Object.values(UserRole) as [string, ...string[]];
export const genderValues = Object.values(Gender) as [string, ...string[]];
export const UserModel = Zod.object({
  id: Zod.string(),
  clerkId: Zod.string(),
  userName: Zod.string(),
  email: Zod.string().email(),
  phone: Zod.string(),

  firstName: Zod.string(),
  lastName: Zod.string(),
  avatar: Zod.string(),
  cover: Zod.string().date(),
  role: Zod.enum(roleValues),
  dob: Zod.string().datetime(),
  gender: Zod.enum(genderValues),

  customerId: Zod.string(),

  createdAt: Zod.date(),
  updatedAt: Zod.date(),
  deletedAt: Zod.date(),
});
