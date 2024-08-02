import * as express from 'express';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    express.json({
      type: 'application/json',
      verify: (req, res, buffer) => (req['rawBody'] = buffer),
    }),
  );

  await app.listen(3000);
}
bootstrap();
