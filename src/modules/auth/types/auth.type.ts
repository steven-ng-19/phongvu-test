import {
  ADMIN_JWT_TOKEN,
  CLERK_JWT_TOKEN,
  FORGOT_TOKEN,
  JWT_ACCESS_TOKEN,
  JWT_REFRESH_TOKEN,
} from '../constants';

export type TokenType =
  | typeof ADMIN_JWT_TOKEN
  | typeof JWT_ACCESS_TOKEN
  | typeof JWT_REFRESH_TOKEN
  | typeof FORGOT_TOKEN
  | typeof CLERK_JWT_TOKEN;

export type TokenPayload = {
  id: string;
  code?: string;
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

export type ClerkPayload = {
  avatar: string | null;
  email: string;
  exp: number;
  firstName: string | null;
  iat: number;
  iss: string;
  jti: string;
  lastName: string | null;
  nbf: number;
  phone: string | null;
  sid: string;
  sub: string;
  userId: string;
  userName: string | null;
  localId: string;
};
