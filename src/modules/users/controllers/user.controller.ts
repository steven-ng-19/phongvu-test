import { string } from 'zod';
import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../services';
import { RequestUser } from 'src/common/decorators';
import { ClerkPayload } from 'src/modules/auth/types';
import { UpdateUserDto, UpdateUserValidator } from '../dtos';
import { ClerkAuthGuard } from 'src/modules/auth/guards';
import { ZodValidationPipe } from 'src/common/pipes';

import { Gender } from 'src/common/enums';
import { UserJSON, UserWebhookEvent } from '@clerk/clerk-sdk-node';
import { CLERK_WEBHOOK_EVENT } from '../constants';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @UseGuards(ClerkAuthGuard)
  @Get()
  async getProffile(@RequestUser() user: ClerkPayload) {
    return await this._userService.findOne({ clerkId: user.userId });
  }

  @Post('clerk')
  async reciveClerkEvent(@Body() payload: UserWebhookEvent) {
    console.log(payload);
    switch (payload.type) {
      case CLERK_WEBHOOK_EVENT.USER_CREATED: {
        return;
        break;
      }
      case CLERK_WEBHOOK_EVENT.USER_UPDATED: {
        const userData = await this._userService.transfromData(
          payload.data as UserJSON,
        );
        const result = await this._userService.update(
          {
            clerkId: payload.data.id!,
          },
          userData,
        );
        break;
      }
      case CLERK_WEBHOOK_EVENT.USER_DELETED: {
        const result = await this._userService.deleteUser({
          clerkId: payload.data.id!,
        });
        break;
      }
    }
    // await this._userService.update(data);
  }
}
