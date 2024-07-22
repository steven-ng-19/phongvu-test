import * as Zod from 'zod';

export const AdderssModel = Zod.object({
  id: Zod.string(),
  userId: Zod.string(),
  fullName: Zod.string(),
  phone: Zod.string(),
  address: Zod.string(),
  ward: Zod.string(),
  district: Zod.string(),
  city: Zod.string(),
  country: Zod.string(),
  lateitude: Zod.number(),
  longitude: Zod.number(),
  isDefault: Zod.boolean(),
  createdAt: Zod.date(),
  updatedAt: Zod.date(),
});
