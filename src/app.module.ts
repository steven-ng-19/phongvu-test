import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CONFIG_VAR, ConfigSchema } from './config';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AllExceptionsFilter } from './common/filters';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { Environment } from './common/enums';
import { FirebaseModule } from './shared/firebase/firebase.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailModule } from './shared/mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaModule } from './shared/prisma/prisma.module';
import { ResponseModule } from './shared/response/response.module';
import { ResponseTransformInterceptor } from './common/interceptors';
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

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get(CONFIG_VAR.MAIL_USER),
            pass: configService.get(CONFIG_VAR.MAIL_PASSWORD),
          },
        },
        defaults: {
          from: '"AU Team 2000" <no-reply@example.com>',
        },
        template: {
          dir: 'src/shared/mail/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,

    // Shared
    PrismaModule,
    StripeModule,
    FirebaseModule,
    ResponseModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor },
  ],
})
export class AppModule {}
