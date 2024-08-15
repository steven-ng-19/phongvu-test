import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { AuthService } from '../services';
import {
  ForgotPasswordDto,
  ForgotPasswordValidator,
  LoginValidator,
  RefreshTokenDto,
  RegisterDto,
  RegisterValidator,
} from '../dtos';
import { RequestUser } from 'src/common/decorators';
import { User } from 'src/modules/users/types';
import { ClerkAuthGuard, LocalAuthGuard, UserJwtAccessGuard } from '../guards';
import { ClerkService } from 'src/shared/clerk/clerk.service';
import { ClerkPayload } from '../types';
import { UpdateUserDto } from 'src/modules/users/dtos';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _clerkService: ClerkService,
  ) {}

  @Post('register')
  @UsePipes(ZodValidationPipe)
  async register(@Body() payload: RegisterDto) {
    return await this._authService.register(payload);
  }

  @UseGuards(ClerkAuthGuard)
  @Post('login')
  async login(@RequestUser() user: ClerkPayload) {
    return await this._authService.login(user);
  }

  @UseGuards(ClerkAuthGuard)
  @Get('clerk-user')
  async getClerkUser(@RequestUser() user: User) {
    return await this._clerkService.getProfile(user.id);
  }
}
