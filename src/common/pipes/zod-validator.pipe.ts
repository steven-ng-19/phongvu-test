import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly _schema: ZodSchema<any>) {}

  transform(value: any) {
    const result = this._schema.safeParse(value);
    if (result.error) {
      throw new HttpException(
        {
          code: result.error.errors[0].code,
          path: result.error.errors[0].path[0],
          message: result.error.errors,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return result.data;
  }
}
