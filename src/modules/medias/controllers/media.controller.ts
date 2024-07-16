import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import {
  PresignedUrlDto,
  PresignedUrlValidator,
  PresignedUrlsDto,
  PresignedUrlsValidator,
} from '../dtos';
import { MediaService } from '../services';
import { ZodValidationPipe } from 'src/common/pipes';
import { JwtAuthGuard } from 'src/modules/auth/guards';

@Controller('medias')
export class MediaController {
  constructor(private readonly _mediaService: MediaService) {}

  @Post('presigned-url')
  @UseGuards(JwtAuthGuard)
  async getUploadPresignedUrl(
    @Body(new ZodValidationPipe(PresignedUrlValidator)) data: PresignedUrlDto,
  ) {
    return this._mediaService.getPresignedUrl(data);
  }

  @Post('presigned-urls')
  @UseGuards(JwtAuthGuard)
  async getUploadPresignedUrls(
    @Body(new ZodValidationPipe(PresignedUrlsValidator)) data: PresignedUrlsDto,
  ) {
    return this._mediaService.getPresignedUrls(data);
  }
}
