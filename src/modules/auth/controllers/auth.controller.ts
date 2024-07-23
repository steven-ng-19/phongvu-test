import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AuthService } from '../services';
import { ZodValidationPipe } from 'src/common/pipes';
import {
  LoginValidator,
  RefreshTokenDto,
  RegisterDto,
  RegisterValidator,
} from '../dtos';
import { RequestUser } from 'src/common/decorators';
import { User } from 'src/modules/users/types';
import { LocalAuthGuard, UserJwtAccessGuard } from '../guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(RegisterValidator)) data: RegisterDto,
  ) {
    return await this._authService.register(data);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@RequestUser() user: User) {
    return await this._authService.login(user);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body(new ZodValidationPipe(RegisterValidator)) data: RefreshTokenDto,
  ) {
    return await this._authService.refreshToken(data);
  }
}
