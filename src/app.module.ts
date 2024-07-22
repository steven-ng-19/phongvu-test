import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CONFIG_VAR, ConfigSchema } from './config';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AllExceptionsFilter } from './common/filters';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Environment } from './common/enums';
import { FirebaseModule } from './shared/firebase/firebase.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaModule } from './shared/prisma/prisma.module';
import { ResponseTransformInterceptor } from './common/interceptors';
import { SendGridModule } from './shared/mail/mail.module';
import { StripeModule } from './shared/stripe/stripe.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || Environment.DEVELOPMENT}`,
      isGlobal: true,
      cache: true,
      validate(config) {
        return ConfigSchema.parse(config);
      },
    }),
    UserModule,

    // Shared
    PrismaModule,
    StripeModule,
    SendGridModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor },
  ],
})
export class AppModule {}
