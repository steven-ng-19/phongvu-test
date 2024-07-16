import { ADDRESS_MODEL, AddressDocument } from '../models/address.schema';
import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from '../dto';
import { User } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(ADDRESS_MODEL) private addressModel: Model<AddressDocument>,
  ) {}

  async createAddress<T>(data: CreateAddressDto, user: User): Promise<T> {
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

    return this.addressModel.create({ ...data, user: userId }) as T;
  }
}
