import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { Type, applyDecorators } from '@nestjs/common';

import { HttpSuccessResponse } from 'src/common/responses';

export function ApiSuccessResponse<T extends Type<unknown>>(
  data: T,
  isArray = false,
) {
  return applyDecorators(
    ApiExtraModels(HttpSuccessResponse, data),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(HttpSuccessResponse) },
          {
            type: 'object',
            properties: {
              data: isArray
                ? { type: 'array', items: { $ref: getSchemaPath(data) } }
                : { $ref: getSchemaPath(data) },
            },
          },
        ],
      },
    }),
  );
}
