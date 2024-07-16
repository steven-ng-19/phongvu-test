import { MediaController } from './controllers';
import { MediaService } from './services';
import { Module } from '@nestjs/common';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
