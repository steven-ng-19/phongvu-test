import {
  ClerkClient,
  Client,
  User,
  createClerkClient,
} from '@clerk/clerk-sdk-node';
import { Inject, Injectable } from '@nestjs/common';

import { CONFIG_VAR } from 'src/config';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from 'src/modules/auth/dtos';
import { UpdateUserDto } from 'src/modules/users/dtos';
import { UpdateUserParams } from 'src/modules/users/types';

@Injectable()
export class ClerkService {
  private readonly clerkClient: ClerkClient;
  constructor(private readonly _configService: ConfigService) {
    this.clerkClient = createClerkClient({
      secretKey: _configService.get(CONFIG_VAR.CLERK_API_SECRET_KEY),
    });
  }

  async verifyToken(token: string): Promise<any> {
    console.log('verify token', token);
    try {
      const verifyToken = await this.clerkClient.clients.verifyClient(token);
      console.log(verifyToken);
      return verifyToken;
    } catch (error) {
      console.log(error);
    }
  }

  async getProfile(userId: string): Promise<User> {
    const profile = await this.clerkClient.users.getUser(userId);
    return profile;
  }

  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const checkPassword = await this.clerkClient.users.verifyPassword({
      userId,
      password,
    });
    return checkPassword.verified;
  }

  async updatePassword(userId: string, password: string): Promise<User> {
    const user = await this.clerkClient.users.updateUser(userId, {
      password,
      passwordHasher: 'bcrypt',
    });
    return user;
  }

  async updateUser(userId: string, data: UpdateUserParams): Promise<User> {
    const user = await this.clerkClient.users.updateUser(userId, {
      firstName: data.firstName ? data.firstName : undefined,
      lastName: data.lastName ? data.lastName : undefined,
      username: data.userName ? data.userName : undefined,
    });

    return user;
  }
}
