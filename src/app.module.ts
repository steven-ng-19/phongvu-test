import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CONFIG_VAR, ConfigSchema } from './config';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AllExceptionsFilter } from './common/filters';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { MediaModule } from './modules/medias/media.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { PromotionModule } from './modules/promotions/promotions.module';
import { ResponseTransformInterceptor } from './common/interceptors';
import { S3Module } from './shared/s3/s3.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
      cache: true,
      validate(config) {
        return ConfigSchema.parse(config);
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get(CONFIG_VAR.MONGO_DB_URI),
      }),
    }),
    StripeModule,
    UsersModule,
    CategoriesModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    PromotionModule,
    S3Module,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor },
  ],
})
export class AppModule {}
