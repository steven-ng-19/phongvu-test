import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards';
import { AddressService, UsersService } from '../services';
import { StripeService } from 'src/shared/stripe/services';
import { RequestUser } from 'src/common/decorators';
import { User } from '../models';
import { ZodValidationPipe } from 'src/common/pipes';
import {
  CreateAddressDto,
  CreateAddressValidator,
  UpdateAddressDto,
  UpdateAddressValidator,
  UpdateProfileDto,
  UpdateProfileValidator,
} from '../dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private addressService: AddressService,
    private stripeService: StripeService,
  ) {}

  @Get('me/profile')
  async getOwnProfile(@RequestUser() account: User) {
    const { _id: userId } = account;
    const user = await this.usersService.findOne({ _id: userId });
    const {
      _id,
      username,
      email,
      phone,
      isEmailVerified,
      isPhoneVerified,
      firstName,
      lastName,
      avatar,
      cover,
      role,
      dob,
      gender,
      status,
    } = user;

    return {
      _id,
      username,
      email,
      phone,
      isEmailVerified,
      isPhoneVerified,
      firstName,
      lastName,
      avatar,
      cover,
      role,
      dob,
      gender,
      status,
    };
  }

  @Put('me/profile')
  async updateProfile(
    @RequestUser() reqUser: User,
    @Body(new ZodValidationPipe(UpdateProfileValidator)) data: UpdateProfileDto,
  ) {
    const { _id: userId } = reqUser;
    const user = await this.usersService.updateUser(userId, data);

    const {
      _id,
      username,
      email,
      phone,
      isEmailVerified,
      isPhoneVerified,
      firstName,
      lastName,
      avatar,
      cover,
      role,
      dob,
      gender,
      status,
    } = user;

    return {
      _id,
      username,
      email,
      phone,
      isEmailVerified,
      isPhoneVerified,
      firstName,
      lastName,
      avatar,
      cover,
      role,
      dob,
      gender,
      status,
    };
  }

  @Get('me/payment-methods')
  async getListPaymentMethods(@RequestUser() reqUser: User) {
    const { _id: userId } = reqUser;
    let { customerId } = reqUser;

    if (!customerId) {
      // Create customer
      const customer = await this.stripeService.createCustomer(reqUser);
      customerId = customer.id;

      // Update user
      await this.usersService.updateUser(userId, {
        customerId,
      });
    }

    return this.stripeService.getListPaymentMethods(customerId);
  }

  @Post('me/payment-methods')
  async addPaymentMethod(@Req() req: Request) {
    const { _id: userId } = req.user as User;
    let { customerId } = req.user as User;

    if (!customerId) {
      // Create customer
      const customer = await this.stripeService.createCustomer(
        req.user as User,
      );
      customerId = customer.id;

      // Update user
      await this.usersService.updateUser(userId, {
        customerId,
      });
    }

    return this.stripeService.createSetupIntent(customerId);
  }

  @Delete('me/payment-methods/:paymentMethodId')
  async deletePaymentMethod(@Param('paymentMethodId') paymentMethodId: string) {
    return this.stripeService.detachPaymentMethod(paymentMethodId);
  }

  @Post('me/addresses')
  async createAddress(
    @RequestUser() reqUser: User,
    @Body(new ZodValidationPipe(CreateAddressValidator)) data: CreateAddressDto,
  ) {
    return this.addressService.createAddress(data, reqUser);
  }

  @Get('me/addresses')
  async getAddresses(@RequestUser() reqUser: User) {
    return this.addressService.getAddresses(reqUser);
  }

  @Get('me/addresses/:addressId')
  async getAddress(
    @RequestUser() reqUser: User,
    @Param('addressId') addressId: string,
  ) {
    return this.addressService.getAddress(addressId, reqUser);
  }

  @Put('me/addresses/:addressId')
  async updateAddress(
    @Req() req: Request,
    @Param('addressId') addressId: string,
    @Body(new ZodValidationPipe(UpdateAddressValidator)) data: UpdateAddressDto,
  ) {
    return this.addressService.updateAddress(addressId, data, req.user as User);
  }

  @Delete('me/addresses/:addressId')
  async deleteAddress(
    @Req() req: Request,
    @Param('addressId') addressId: string,
  ) {
    return this.addressService.deleteAddress(addressId, req.user as User);
  }
}
