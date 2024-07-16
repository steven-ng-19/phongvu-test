import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services';
import { RequestUser } from 'src/common/decorators';
import { User } from 'src/modules/users/models';
import { ZodValidationPipe } from 'src/common/pipes/zod-validator.pipe';
import {
  ForgotPasswordDto,
  ForgotPasswordValidator,
  RefreshTokenDto,
  RefreshTokenValidator,
  ResetPasswordDto,
  ResetPasswordValidator,
} from '../dtos';
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@RequestUser() user: User) {
    const result = await this.authService.login(user);

    return result;
  }

  @Post('refresh-token')
  async refreshToken(
    @Body(new ZodValidationPipe(RefreshTokenValidator)) data: RefreshTokenDto,
  ) {
    const { refreshToken } = data;
    const result = await this.authService.refreshToken(refreshToken);

    return result;
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body(new ZodValidationPipe(ForgotPasswordValidator))
    data: ForgotPasswordDto,
  ) {
    const { resetPasswordToken } = await this.authService.forgotPassword(data);

    return { resetPasswordToken };
  }

  @Post('reset-password')
  async resetPassword(
    @Body(new ZodValidationPipe(ResetPasswordValidator)) data: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(data);
  }
}
