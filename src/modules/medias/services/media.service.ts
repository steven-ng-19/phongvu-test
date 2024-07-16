import { PresignedUrlDto, PresignedUrlsDto } from '../dtos';

import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/shared/s3/services';

@Injectable()
export class MediaService {
  constructor(private readonly _s3Service: S3Service) {}

  async getPresignedUrl(data: PresignedUrlDto) {
    const { url, key } = await this._s3Service.getPresignedUrl(data);
    return {
      url,
      key,
    };
  }

  async getPresignedUrls(data: PresignedUrlsDto) {
    const result = await Promise.all(
      data.urls.map(async (item) => {
        const { key, url } = await this._s3Service.getPresignedUrl(item);
        return {
          url,
          key,
        };
      }),
    );
    return [...result];
  }
}
