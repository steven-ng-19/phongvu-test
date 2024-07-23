import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services';
import { RequestUser } from 'src/common/decorators';
import { User } from '@prisma/client';
import { ZodValidationPipe } from 'src/common/pipes';
import { RefreshTokenDto, RefreshTokenValidator } from '../dtos';

@Controller('auth/admin')
export class AdminAuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('login')
  async login(@RequestUser() user: User) {
    return await this._authService.adminLogin(user);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body(new ZodValidationPipe(RefreshTokenValidator)) data: RefreshTokenDto,
  ) {
    return await this._authService.adminRefreshToken(data);
  }
}
