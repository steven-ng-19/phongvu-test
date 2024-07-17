import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../services';
import {
  ForgotPasswordDto,
  ForgotPasswordValidator,
  RefreshTokenDto,
  RefreshTokenValidator,
  RegisterDto,
  RegisterValidator,
  ResetPasswordDto,
} from '../dtos';
import { ResponseTypeGeneric } from 'src/shared/types';
import { User } from 'src/modules/users/models';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RequestUser } from 'src/common/decorators';
import { ZodValidationPipe } from 'src/common/pipes/zod-validator.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(RegisterValidator)) data: RegisterDto,
  ) {
    const result = await this._authService.register(data);
    return result;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@RequestUser() user: User) {
    const result = await this._authService.login(user);

    return result;
  }

  @Post('refresh-token')
  async refreshToken(
    @Body(new ZodValidationPipe(RefreshTokenValidator)) data: RefreshTokenDto,
  ) {
    const { refreshToken } = data;
    const result = await this._authService.refreshToken(refreshToken);

    return result;
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body(new ZodValidationPipe(ForgotPasswordValidator))
    data: ForgotPasswordDto,
  ) {
    const { resetPasswordToken } = await this._authService.forgotPassword(data);

    return { resetPasswordToken };
  }

  @Post('reset-password')
  async resetPassword(
    @Body(new ZodValidationPipe(RegisterValidator)) data: ResetPasswordDto,
  ) {
    return this._authService.resetPassword(data);
  }
}
