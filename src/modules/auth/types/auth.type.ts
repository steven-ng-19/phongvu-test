import * as Zod from 'zod';

import {
  ADMIN_JWT_TOKEN,
  FORGOT_TOKEN,
  JWT_ACCESS_TOKEN,
  JWT_REFRESH_TOKEN,
} from '../constants';

import { User } from 'src/modules/users/types';

export type TokenType =
  | typeof ADMIN_JWT_TOKEN
  | typeof JWT_ACCESS_TOKEN
  | typeof JWT_REFRESH_TOKEN
  | typeof FORGOT_TOKEN;

export type TokenPayload = {
  id: string;
};

export type ResponseToken = {
  accessToken: string;
  accessTokenExpiration: number | undefined;
  refreshToken?: string;
  refreshTokenExpiration?: number | undefined;
};

export type JwtAccessPayload = {
  id: string;
  iat: number;
  exp: number;
};
