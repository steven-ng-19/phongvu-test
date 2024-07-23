import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AUTH_ERRORS } from 'src/common/contents/errors/auth.error';
import { CONFIG_VAR } from 'src/config';
import { ConfigService } from '@nestjs/config';
import { JwtAccessPayload } from '../types';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UserRole } from 'src/common/enums';
import { UserService } from 'src/modules/users/services';
import { ignoreElements } from 'rxjs';

export const ADMIN_STRATEGY = 'admin-strategy';
@Injectable()
export class AdminJwtAccessStrategy extends PassportStrategy(
  Strategy,
  ADMIN_STRATEGY,
) {
  constructor(
    private readonly _userService: UserService,
    private readonly _configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.getOrThrow(CONFIG_VAR.ADMIN_JWT_SECRET),
    });
  }

  async validate(payload: JwtAccessPayload): Promise<JwtAccessPayload> {
    const admin = await this._userService.findOneByConditions({
      id: payload.id,
      role: UserRole.ADMIN,
    });

    if (!admin) throw new UnauthorizedException(AUTH_ERRORS.INVALID_TOKEN);

    return payload;
  }
}
