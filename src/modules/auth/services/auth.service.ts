import * as bcrypt from 'bcryptjs';

import {
  ADMIN_JWT_TOKEN,
  CLERK_JWT_TOKEN,
  FORGOT_TOKEN,
  JWT_ACCESS_TOKEN,
  JWT_REFRESH_TOKEN,
} from '../constants';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClerkPayload, ResponseToken, TokenPayload, TokenType } from '../types';
import { CreateUserDto, UserKeys } from 'src/modules/users/entities';
import { CreateUserParams, User } from 'src/modules/users/types';
import { ForgotPasswordDto, LoginDto, RefreshTokenDto } from '../dtos';
import { Gender, UserRole } from 'src/common/enums';
import { JwtPayload, SignOptions, decode, sign, verify } from 'jsonwebtoken';

import { AUTH_ERRORS } from 'src/common/contents/errors/auth.error';
import { AuthQueueService } from './auth-queue.service';
import { CONFIG_VAR } from 'src/config';
import { ClerkService } from 'src/shared/clerk/clerk.service';
import { ConfigService } from '@nestjs/config';
import { MAIL_TEMPLATE } from 'src/shared/mail/constants';
import { MailService } from 'src/shared/mail/services';
import { RegisterDto } from '../dtos/register.dto';
import { ResponseSuccess } from 'src/common/types';
import { UpdateUserDto } from 'src/modules/users/dtos';
import { UserService } from 'src/modules/users/services';
import { randomBytes } from 'crypto';
import { string } from 'zod';

@Injectable()
export class AuthService {
  private readonly _jwtKeys: {
    [ADMIN_JWT_TOKEN]: string;
    [JWT_ACCESS_TOKEN]: string;
    [JWT_REFRESH_TOKEN]: string;
    [FORGOT_TOKEN]: string;
    [CLERK_JWT_TOKEN]: string;
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
    private readonly _authQueueService: AuthQueueService,
    private readonly _clerkService: ClerkService,
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
      [CLERK_JWT_TOKEN]: _configService.getOrThrow(
        CONFIG_VAR.CLERK_JWT_KEY,
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

  async login(data: ClerkPayload): Promise<ResponseSuccess<void>> {
    const user = await this._userService.findOne({ clerkId: data.userId });
    if (!user) throw new BadRequestException(AUTH_ERRORS.NOT_FOUND);
    return { success: true };
  }

  async adminLogin(data: ClerkPayload): Promise<ResponseSuccess<void>> {
    const user = await this._userService.findOne({ clerkId: data.userId });
    if (!user) throw new BadRequestException(AUTH_ERRORS.NOT_FOUND);
    if (user.role !== UserRole.ADMIN)
      throw new BadRequestException(AUTH_ERRORS.NOT_PERMISSION);
    return { success: true };
  }

  async register(data: RegisterDto): Promise<ResponseSuccess<void>> {
    const clerkUser = await this._verifyToken(data.token, CLERK_JWT_TOKEN);
    const existedUser = await this._userService.findOne(
      {
        clerkId: clerkUser.userId,
      },
      true,
    );
    if (existedUser) {
      const userData: UpdateUserDto = {
        firstName: clerkUser.firstName ?? existedUser.firstName,
        lastName: clerkUser.lastName ?? existedUser.lastName,
        avatar: clerkUser.avatar ?? existedUser.avatar,
      };

      const user = await this._userService.update(
        { id: existedUser.id },
        userData,
      );
      return { success: true };
    }

    const userData: CreateUserDto = {
      clerkId: clerkUser.userId,
      email: clerkUser.email,
      firstName: clerkUser.firstName ? clerkUser.firstName : '',
      lastName: clerkUser.lastName,
      phone: clerkUser.phone ? clerkUser.phone : '',
      role: UserRole.USER,
      gender: Gender.OTHER,
      userName: clerkUser.userName ? clerkUser.userName : '',
      avatar: clerkUser.avatar,
    };
    console.log(clerkUser);
    const user = await this._userService.create(userData);
    return { success: true };
  }

  // async forgotPassword({ email }: ForgotPasswordDto): Promise<ResponseSuccess> {
  //   const user = await this._userService.findOne({ email });
  //   if (!user) throw new BadRequestException(AUTH_ERRORS.NOT_FOUND);

  //   const code = await this._generateCode();
  //   const payload: TokenPayload = { id: user.id, code: code };
  //   const token = await this._generateToken(payload, FORGOT_TOKEN);

  //   const url = `http://localhost:3000/reset-password-ui/?token=${token}`;
  //   await this._authQueueService.addJobSendEmailResetPassword(email, url);
  //   return { success: true };
  // }

  async validateUser(clerkId: string): Promise<User> {
    const user = await this._userService.findOne({ clerkId });
    if (!user) throw new BadRequestException(AUTH_ERRORS.NOT_FOUND);
    return user;
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

  private async _generateCode(): Promise<string> {
    return randomBytes(4).toString('hex');
  }

  private async _generateToken(
    payload: TokenPayload,
    type: TokenType,
  ): Promise<string> {
    return sign(payload, this._jwtKeys[type], this._jwtOptions[type]);
  }

  private _verifyToken(token: string, type: TokenType): ClerkPayload {
    const payload = verify(token, this._jwtKeys[type]);
    if (!payload) throw new UnauthorizedException(AUTH_ERRORS.INVALID_TOKEN);
    return payload as ClerkPayload;
  }

  private _decodeToken(token: string): string | JwtPayload | null {
    return decode(token);
  }
}
