import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto, LoginValidator } from '../dtos';

import { AuthService } from '../services';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

export const LOCAL_STRATEGY = 'local';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LOCAL_STRATEGY) {
  constructor(private readonly _authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  // async validate(email: string, password: string) {
  //   const valiadte = LoginValidator.safeParse({ email, password });

  //   if (valiadte.error) {
  //     throw new BadRequestException(valiadte.error.errors);
  //   }
  //   const user = await this._authService.validateUser({ email, password });

  //   return user;
  // }
}
