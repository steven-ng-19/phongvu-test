import { CONFIG_VAR } from './config.constant';
import { z } from 'zod';

export const ConfigSchema = z
  .object({
    // STRIPE
    [CONFIG_VAR.STRIPE_API_SECRET_KEY]: z.string().trim(),
    [CONFIG_VAR.STRIPE_PUBLIC_KEY]: z.string().trim(),

    //ADMIN ACCOUNT
    [CONFIG_VAR.DEFAULT_ADMIN_USERNAME]: z.string().trim(),
    [CONFIG_VAR.DEFAULT_ADMIN_PASSWORD]: z.string().trim(),
    [CONFIG_VAR.DEFAULT_ADMIN_EMAIL]: z.string().trim().email(),

    // MONGODB
    [CONFIG_VAR.MONGO_DB_URI]: z.string().trim(),

    // JWT
    [CONFIG_VAR.JWT_SECRET]: z.string().trim(),
    [CONFIG_VAR.JWT_EXPIRES_IN]: z.string().trim(),
    [CONFIG_VAR.JWT_REFRESH_SECRET]: z.string().trim(),
    [CONFIG_VAR.JWT_REFRESH_EXPIRES_IN]: z.string().trim(),

    // REDIS
    [CONFIG_VAR.REDIS_HOST]: z.string().trim(),
    [CONFIG_VAR.REDIS_PORT]: z.string().trim(),
    [CONFIG_VAR.REDIS_PASSWORD]: z.string().trim(),

    // SENDGRID
    [CONFIG_VAR.SENDGRID_API_KEY]: z.string().trim(),

    // CLOUDINARY
    [CONFIG_VAR.CLOUDINARY_NAME]: z.string().trim(),
    [CONFIG_VAR.CLOUDINARY_API_KEY]: z.string().trim(),
    [CONFIG_VAR.CLOUDINARY_API_SECRET]: z.string().trim(),

    // FIREBASE
    [CONFIG_VAR.FIREBASE_PROJECT_ID]: z.string().trim(),
    [CONFIG_VAR.FIREBASE_PRIVATE_KEY]: z.string().trim(),
    [CONFIG_VAR.FIREBASE_CLIENT_EMAIL]: z.string().trim(),

    //S3
    [CONFIG_VAR.AWS_ACCESS_KEY_ID]: z.string().trim(),
    [CONFIG_VAR.AWS_BUCKET_S3]: z.string().trim(),
    [CONFIG_VAR.AWS_ENDPOINT]: z.string().trim(),
    [CONFIG_VAR.AWS_REGION]: z.string().trim(),
    [CONFIG_VAR.AWS_SECRET_ACCESS_KEY]: z.string().trim(),
  })
  .required();

export type ConfigSType = z.infer<typeof ConfigSchema>;
