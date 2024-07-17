import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards';
import { WishlistService } from '../services';
import { ZodValidationPipe } from 'src/common/pipes';
import {
  CreateWishDto,
  CreateWishValidator,
  EditWishDto,
  EditWishValidator,
} from '../dto';
import { RequestUser } from 'src/common/decorators';
import { User } from 'src/modules/users/models';
import { WishQueryParams } from 'src/shared/types';

@UseGuards(JwtAuthGuard)
@Controller('wishes')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Post()
  async createWish(
    @RequestUser() user: User,
    @Body(new ZodValidationPipe(CreateWishValidator)) data: CreateWishDto,
  ) {
    return this.wishlistService.createWish(data, user);
  }

  @Get()
  async getWishes(@RequestUser() user: User, @Query() query: WishQueryParams) {
    return this.wishlistService.getWishes({
      ...query,
      where: { user: user._id },
    });
  }

  @Get(':wishId')
  async getWish(@RequestUser() user: User, @Param('wishId') wishId: string) {
    return this.wishlistService.getWish(wishId);
  }

  @Put(':wishId')
  async editWish(
    @Param('wishId') wishId: string,
    @Body(new ZodValidationPipe(EditWishValidator)) data: EditWishDto,
  ) {
    return this.wishlistService.editWish(wishId, data);
  }

  @Delete(':wishId')
  async deleteWish(@Param('wishId') wishId: string) {
    return this.wishlistService.deleteWish(wishId);
  }
}
