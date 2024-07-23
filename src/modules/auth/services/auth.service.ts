import * as bcrypt from 'bcryptjs';

import {
  ADMIN_JWT_TOKEN,
  FORGOT_TOKEN,
  JWT_ACCESS_TOKEN,
  JWT_REFRESH_TOKEN,
} from '../constants';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserParams, User } from 'src/modules/users/types';
import { Gender, UserRole } from 'src/common/enums';
import { JwtPayload, SignOptions, decode, sign, verify } from 'jsonwebtoken';
import { LoginDto, RefreshTokenDto } from '../dtos';
import { ResponseToken, TokenPayload, TokenType } from '../types';

import { AUTH_ERRORS } from 'src/common/contents/errors/auth.error';
import { CONFIG_VAR } from 'src/config';
import { ConfigService } from '@nestjs/config';
import { MAIL_TEMPLATE } from 'src/shared/mail/constants';
import { MailService } from 'src/shared/mail/services';
import { RegisterDto } from '../dtos/register.dto';
import { ResponseSuccess } from 'src/common/types';
import { UserKeys } from 'src/modules/users/entities';
import { UserService } from 'src/modules/users/services';
import { string } from 'zod';

@Injectable()
export class AuthService {
  private readonly _jwtKeys: {
    [ADMIN_JWT_TOKEN]: string;
    [JWT_ACCESS_TOKEN]: string;
    [JWT_REFRESH_TOKEN]: string;
    [FORGOT_TOKEN]: string;
  };
  private readonly _jwtOptions: {
    [ADMIN_JWT_TOKEN]: SignOptions;
    [JWT_ACCESS_TOKEN]: SignOptions;
    [JWT_REFRESH_TOKEN]: SignOptions;
    [FORGOT_TOKEN]: SignOptions;
  };
  constructor(
    private readonly _userService: UserService,
    private readonly _configService: ConfigService,
    private readonly _mailService: MailService,
  ) {
    this._jwtKeys = {
      [ADMIN_JWT_TOKEN]: _configService.getOrThrow(
        CONFIG_VAR.ADMIN_JWT_SECRET,
        'default_secret',
      ),
      [JWT_ACCESS_TOKEN]: _configService.getOrThrow(
        CONFIG_VAR.JWT_SECRET,
        'default_secret',
      ),
      [JWT_REFRESH_TOKEN]: _configService.getOrThrow(
        CONFIG_VAR.JWT_REFRESH_SECRET,
        'default_secret',
      ),
      [FORGOT_TOKEN]: _configService.getOrThrow(
        CONFIG_VAR.FORGOT_JWT_SECRET,
        'default_secret',
      ),
    };
    this._jwtOptions = {
      [ADMIN_JWT_TOKEN]: {
        expiresIn: _configService.getOrThrow(CONFIG_VAR.JWT_ACCESS_EXPIRES_IN),
      },
      [JWT_ACCESS_TOKEN]: {
        expiresIn: _configService.getOrThrow(CONFIG_VAR.JWT_ACCESS_EXPIRES_IN),
      },
      [JWT_REFRESH_TOKEN]: {
        expiresIn: _configService.getOrThrow(CONFIG_VAR.JWT_REFRESH_EXPIRES_IN),
      },
      [FORGOT_TOKEN]: {
        expiresIn: _configService.getOrThrow(CONFIG_VAR.JWT_FORGOT_EXPIRES_IN),
      },
    };
  }

  async login(user: User): Promise<ResponseToken> {
    const { id } = user;
    const payload: TokenPayload = { id };
    const accessToken = await this._generateToken(payload, JWT_ACCESS_TOKEN);
    const refreshToken = await this._generateToken(payload, JWT_REFRESH_TOKEN);
    const { exp: accessTokenExpiration } = this._decodeToken(
      accessToken,
    ) as JwtPayload;
    const { exp: refreshTokenExpiration } = this._decodeToken(
      refreshToken,
    ) as JwtPayload;
    const result: ResponseToken = {
      accessToken,
      accessTokenExpiration,
      refreshToken,
      refreshTokenExpiration,
    };
    return result;
  }

  async adminLogin(user: User): Promise<ResponseToken> {
    const { id, role } = user;
    if (role !== UserRole.ADMIN)
      throw new BadRequestException(AUTH_ERRORS.NOT_PERMISSION);
    const payload: TokenPayload = { id };
    const accessToken = await this._generateToken(payload, ADMIN_JWT_TOKEN);
    const refreshToken = await this._generateToken(payload, ADMIN_JWT_TOKEN);
    const { exp: accessTokenExpiration } = this._decodeToken(
      accessToken,
    ) as JwtPayload;
    const { exp: refreshTokenExpiration } = this._decodeToken(
      refreshToken,
    ) as JwtPayload;
    const result: ResponseToken = {
      accessToken,
      accessTokenExpiration,
      refreshToken,
      refreshTokenExpiration,
    };
    return result;
  }

  async register(data: RegisterDto): Promise<ResponseSuccess> {
    const existedUser = await this._userService.findOne({
      email: data.email,
    });
    if (existedUser) throw new BadRequestException(AUTH_ERRORS.CANNOT_REGISTER);
    data.password = await this._hashPassword(data.password);
    const userData: CreateUserParams = {
      ...data,
      gender: Gender.OTHER,
      role: UserRole.USER,
    };
    const user = await this._userService.create(userData);
    return { success: true };
  }

  async refreshToken({
    refreshToken,
  }: RefreshTokenDto): Promise<ResponseToken> {
    const verify = this._verifyToken(refreshToken, JWT_REFRESH_TOKEN);
    if (!verify) throw new UnauthorizedException(AUTH_ERRORS.INVALID_TOKEN);

    const { id } = verify as JwtPayload;
    const user = await this._userService.findOne({ id });
    if (!user) throw new UnauthorizedException(AUTH_ERRORS.INVALID_TOKEN);

    const payload: TokenPayload = { id };
    const accessToken = await this._generateToken(payload, JWT_ACCESS_TOKEN);

    const { exp: accessTokenExpiration } = this._decodeToken(
      accessToken,
    ) as JwtPayload;

    const result: ResponseToken = {
      accessToken,
      accessTokenExpiration,
    };
    return result;
  }

  async adminRefreshToken({
    refreshToken,
  }: RefreshTokenDto): Promise<ResponseToken> {
    const verify = this._verifyToken(refreshToken, ADMIN_JWT_TOKEN);
    if (!verify) throw new UnauthorizedException(AUTH_ERRORS.INVALID_TOKEN);

    const { id } = verify as JwtPayload;
    const user = await this._userService.findOne({ id });
    if (!user) throw new UnauthorizedException(AUTH_ERRORS.INVALID_TOKEN);

    if (user.role !== UserRole.ADMIN)
      throw new UnauthorizedException(AUTH_ERRORS.INVALID_TOKEN);

    const payload: TokenPayload = { id };
    const accessToken = await this._generateToken(payload, ADMIN_JWT_TOKEN);
    const { exp: accessTokenExpiration } = this._decodeToken(
      accessToken,
    ) as JwtPayload;

    const result: ResponseToken = {
      accessToken,
      accessTokenExpiration,
    };
    return result;
  }

  async forgotPassword(email: string): Promise<ResponseSuccess> {
    const user = await this._userService.findOne({ email });
    if (!user) throw new BadRequestException(AUTH_ERRORS.NOT_FOUND);
    const payload: TokenPayload = { id: user.id };
    const token = await this._generateToken(payload, FORGOT_TOKEN);
    return { success: true };
  }

  async validateUser({ email, password }: LoginDto): Promise<User> {
    const user = await this._userService.findOne({ email });
    if (!user) throw new BadRequestException(AUTH_ERRORS.NOT_FOUND);
    const isMatch = await this._comparePassword(
      password,
      user[UserKeys.password],
    );
    if (isMatch) return user;
    throw new BadRequestException(AUTH_ERRORS.INVALID_CREDENTIALS);
  }

  // PRIVATE FUNCTION
  private async _hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  private async _comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  private async _generateToken(
    payload: TokenPayload,
    type: TokenType,
  ): Promise<string> {
    return sign(payload, this._jwtKeys[type], this._jwtOptions[type]);
  }

  private _verifyToken(token: string, type: TokenType): JwtPayload | string {
    const payload = verify(token, this._jwtKeys[type]);
    if (!payload) throw new UnauthorizedException(AUTH_ERRORS.INVALID_TOKEN);
    return payload;
  }

  private _decodeToken(token: string): string | JwtPayload | null {
    return decode(token);
  }
}
