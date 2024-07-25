import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RefreshTokenDto, RefreshTokenValidator } from '../dtos';

import { AuthService } from '../services';
import { RequestUser } from 'src/common/decorators';
import { User } from '@prisma/client';
import { ZodValidationPipe } from 'src/common/pipes';
import { ClerkAuthGuard } from '../guards';
import { ClerkPayload } from '../types';

@Controller('auth/admin')
export class AdminAuthController {
  constructor(private readonly _authService: AuthService) {}

  @UseGuards(ClerkAuthGuard)
  @Post('login')
  async login(@RequestUser() user: ClerkPayload) {
    return await this._authService.adminLogin(user);
  }
}
