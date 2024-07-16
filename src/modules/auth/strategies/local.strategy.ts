import { BadRequestException, Injectable } from '@nestjs/common';

import { AuthService } from '../services';
import { LoginValidator } from '../dtos';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

export const LOCAL_STRATEGY = 'local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const validate = await LoginValidator.safeParseAsync({ email, password });

    if (validate.error) {
      throw new BadRequestException(validate.error?.errors[0]?.message);
    }

    const user = await this._authService.validateUser(email, password);
    return user;
  }
}
