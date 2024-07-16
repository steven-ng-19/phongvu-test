import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, USER_MODEL } from '../models';
import { UserDocument } from '../entities';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CONFIG_VAR } from 'src/config';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from 'src/modules/auth/dtos';
import { ResponseTypeGeneric } from 'src/shared/types';
import { UserRole, UserStatus } from 'src/common/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(USER_MODEL) private userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}
  async createDefaultAdminUser<T>(): Promise<T> {
    // Check if admin user already exists
    const adminUser = await this.userModel
      .findOne({
        username: this.configService.get(CONFIG_VAR.DEFAULT_ADMIN_USERNAME),
        role: UserRole.SUPER_ADMIN,
      })
      .lean();
    if (adminUser) return;

    // Create admin user
    await this.userModel.create({
      username: this.configService.get(CONFIG_VAR.DEFAULT_ADMIN_USERNAME),
      email: this.configService.get(CONFIG_VAR.DEFAULT_ADMIN_EMAIL),
      hashPassword: bcrypt.hashSync(
        this.configService.get(CONFIG_VAR.DEFAULT_ADMIN_PASSWORD),
        10,
      ),
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
      isPhoneVerified: true,
    });
  }

  async createUser<T>(data: RegisterDto): Promise<ResponseTypeGeneric<T>> {
    const { password } = data;
    const hashPassword = bcrypt.hashSync(password, 10);
    const result = (await this.userModel.create({
      ...data,
      hashPassword,
    })) as T;
    return {
      success: true,
      data: result,
    };
  }

  async findUser(username: string): Promise<User> {
    const user = await this.userModel
      .findOne({
        $or: [{ username }, { email: username }, { phone: username }],
      })
      .lean();
    return user;
  }

  async findOne<T>(conditions: any): Promise<T | null> {
    return this.userModel.findOne(conditions).lean() as T | null;
  }
  async updateUser(userId: string, data: any): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, data, { new: true }).lean();
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
