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

export const USER_STRATEGY = 'user-strategy';
@Injectable()
export class UserJwtAccessStrategy extends PassportStrategy(
  Strategy,
  USER_STRATEGY,
) {
  constructor(
    private readonly _userService: UserService,
    private readonly _configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.getOrThrow(CONFIG_VAR.JWT_SECRET),
    });
  }

  async validate(payload: JwtAccessPayload): Promise<User> {
    const user = await this._userService.findOneByConditions({
      id: payload.id,
      role: UserRole.USER,
    });

    if (!user) throw new UnauthorizedException(AUTH_ERRORS.INVALID_TOKEN);

    return user;
  }
}
