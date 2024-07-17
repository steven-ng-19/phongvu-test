import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ADDRESS_MODEL, AddressDocument, User } from '../models';
import { CreateAddressDto, UpdateAddressDto } from '../dto';

export class AddressService {
  constructor(
    @InjectModel(ADDRESS_MODEL) private addressModel: Model<AddressDocument>,
  ) {}

  async createAddress(data: CreateAddressDto, user: User) {
    const { isDefault } = data;
    const { _id: userId } = user;

    // Check if there is any other address is default
    if (isDefault) {
      await this.addressModel.updateMany(
        { isDefault: true, user: userId },
        { isDefault: false },
      );
    }

    // Check if this is the first address
    const count = await this.addressModel.countDocuments({ user: userId });
    if (count === 0) {
      data.isDefault = true;
    }

    return this.addressModel.create({ ...data, user: userId });
  }

  async getAddresses(user: User) {
    const addresses = await this.addressModel
      .find({ user: user._id })
      .sort({ isDefault: 'desc', createdAt: 'desc' });
    return addresses.map((address) => address.toJSON());
  }

  async getAddress(addressId: string, user: User) {
    const address = this.addressModel.findOne({
      _id: addressId,
      user: user._id,
    });

    return (await address).toJSON();
  }

  async updateAddress(addressId: string, data: UpdateAddressDto, user: User) {
    const { isDefault } = data;

    // Check if there is any other address is default
    if (isDefault) {
      await this.addressModel.updateMany(
        { isDefault: true, _id: { $ne: addressId }, user: user._id },
        { isDefault: false },
      );
    }
    return this.addressModel.findByIdAndUpdate(addressId, data, { new: true });
  }

  async deleteAddress(addressId: string, user: User) {
    const address = await this.addressModel.findOne({
      _id: addressId,
      user: user._id,
    });
    if (address) await address.deleteOne();
  }
}
