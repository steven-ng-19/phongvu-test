import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AUTH_ERRORS } from 'src/common/contents/errors/auth.error';
import { AuthService } from '../services';
import { CONFIG_VAR } from 'src/config';
import { ClerkPayload } from '../types';
import { ClerkService } from 'src/shared/clerk/clerk.service';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '@clerk/clerk-sdk-node';
import { UserRole } from 'src/common/enums';
import { join } from 'path';
import { readFileSync } from 'fs';

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
      secretOrKey: _configService.getOrThrow(CONFIG_VAR.CLERK_JWT_KEY), // Bạn có thể tùy chỉnh phần này nếu cần
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
