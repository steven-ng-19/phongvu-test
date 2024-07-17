import * as bcrypt from 'bcrypt';

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ForgotPasswordDto, RegisterDto, ResetPasswordDto } from '../dtos';

import { CONFIG_VAR } from 'src/config';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ResponseTypeGeneric } from 'src/shared/types';
import { User } from 'src/modules/users/models';
import { UsersService } from 'src/modules/users/services';
import { base64Hash } from 'src/common/utils/hash.util';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(data: RegisterDto) {
    const { email } = data;

    // Check if user with the same email or phone exists
    const existUser = await this._userService.findUser(email);
    if (existUser) throw new Error('User already exists');

    // Create user
    await this._userService.createUser(data);

    // TODO: Send verification email
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this._userService.findUser(username);
    if (user && (await bcrypt.compare(password, user.hashPassword))) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const {
      _id: userId,
      username,
      email,
      phone,
      firstName,
      lastName,
      role,
      status,
    } = user;
    const payload = {
      username,
      userId,
      email,
      phone,
      firstName,
      lastName,
      role,
      status,
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get(CONFIG_VAR.JWT_SECRET),
        expiresIn: this.configService.get<string>(CONFIG_VAR.JWT_EXPIRES_IN),
      }),
      refreshToken: this.jwtService.sign(
        { userId },
        {
          secret: this.configService.get<string>(CONFIG_VAR.JWT_REFRESH_SECRET),
          expiresIn: this.configService.get<string>(
            CONFIG_VAR.JWT_REFRESH_EXPIRES_IN,
          ),
        },
      ),
    };
  }

  async refreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get(CONFIG_VAR.JWT_REFRESH_SECRET),
    });

    const { userId } = payload;
    const user = await this._userService.findOne({ _id: userId });
    if (!user) throw new UnauthorizedException('Invalid token');

    return this.login(user);
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const { email } = data;

    // Check if user with the same email or phone exists
    const existUser = await this._userService.findUser(email);
    if (!existUser) throw new Error('User does not exist');

    const { _id: userId } = existUser;

    // Create reset password token
    const resetPasswordToken = base64Hash(uuidV4());
    await this._userService.updateUser(userId, {
      resetPasswordToken,
    });

    // TODO: Send reset password email

    return { resetPasswordToken }; // For test only
  }

  async resetPassword(data: ResetPasswordDto) {
    const { token, newPassword: password } = data;
    // Check if reset password token exists
    const user = await this._userService.findOne({
      resetPasswordToken: token,
    });
    if (!user) throw new Error('Invalid token');

    // Update user password
    const { _id: userId } = user;
    const hashPassword = bcrypt.hashSync(password, 10);
    await this._userService.updateUser(userId, {
      hashPassword,
      resetPasswordToken: null,
    });
  }
}
