import { ExtractJwt, Strategy } from 'passport-jwt';

import { CONFIG_VAR } from 'src/config';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from 'src/modules/users/services';

export const ACCESS_STRATEGY = 'access_strategy';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, ACCESS_STRATEGY) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(CONFIG_VAR.JWT_SECRET),
    });
  }

  async validate(payload: any) {
    const { userId } = payload;
    const user = await this.usersService.findOne({ _id: userId });
    if (!user) throw new Error('User not found');

    return user;
  }
}
