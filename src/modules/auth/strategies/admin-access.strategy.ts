import { readFileSync } from 'fs';
import { join } from 'path';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_ERRORS } from 'src/common/contents/errors/auth.error';
import { UserRole } from 'src/common/enums';
import { CONFIG_VAR } from 'src/config';
import { ClerkService } from 'src/shared/clerk/clerk.service';
import { User } from '@clerk/clerk-sdk-node';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../services';
import { ClerkPayload } from '../types';

// src/auth/jwt.strategy.ts

export const ADIM_CLERK_STRATEGY = 'admin_clerk';
@Injectable()
export class AdminClerkStategy extends PassportStrategy(
  Strategy,
  ADIM_CLERK_STRATEGY,
) {
  constructor(
    private readonly clerkService: ClerkService,
    private readonly _configService: ConfigService,
    private readonly _authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.getOrThrow(CONFIG_VAR.CLERK_JWT_KEY), // NOTE: comment with vietnamese???: Bạn có thể tùy chỉnh phần này nếu cần
    });
  }

  async validate(payload: ClerkPayload): Promise<ClerkPayload> {
    try {
      const verifiedToken = await this.clerkService.getProfile(payload.sub);
      if (!verifiedToken)
        throw new UnauthorizedException(AUTH_ERRORS.INVALID_TOKEN);
      const user = await this._authService.validateUser(payload.userId);
      if (user.role !== UserRole.ADMIN)
        throw new UnauthorizedException(AUTH_ERRORS.INVALID_TOKEN);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
