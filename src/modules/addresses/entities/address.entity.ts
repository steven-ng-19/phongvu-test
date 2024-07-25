import { AdderssModel } from './address-model.entity';
import { parsePhoneNumber } from 'awesome-phonenumber';

export const AddressShape = AdderssModel.shape;
export const AddressKeys = AdderssModel.keyof().enum;

export const AddressEntity = AdderssModel.extend({
  [AddressKeys.id]: AddressShape.id.uuid().trim(),
  [AddressKeys.address]: AddressShape.address.trim().min(3).max(200),
  [AddressKeys.city]: AddressShape.city.trim().min(3).max(200),
  [AddressKeys.district]: AddressShape.district.trim().min(3).max(200),
  [AddressKeys.country]: AddressShape.country.trim().min(3).max(200),
  [AddressKeys.ward]: AddressShape.ward.trim().min(3).max(200),
  [AddressKeys.fullName]: AddressShape.fullName.trim().min(3).max(100),
  [AddressKeys.phone]: AddressShape.phone.refine((phone) => {
    const phoneNumber = parsePhoneNumber(phone);
    return phoneNumber.valid ? phoneNumber.number : null;
  }),
  [AddressKeys.isDefault]: AddressShape.isDefault.default(false),
  [AddressKeys.lateitude]: AddressShape.lateitude.nullable().optional(),
  [AddressKeys.longitude]: AddressShape.longitude.nullable().optional(),
  [AddressKeys.userId]: AddressShape.userId.uuid().trim(),

  [AddressKeys.deletedAt]: AddressShape.deletedAt.nullable().optional(),
  [AddressKeys.createdAt]: AddressShape.createdAt,
  [AddressKeys.updatedAt]: AddressShape.updatedAt.nullable().optional(),
});
