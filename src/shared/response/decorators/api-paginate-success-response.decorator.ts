import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { Type, applyDecorators } from '@nestjs/common';

export function ApiPaginateSuccessResponse<T extends Type<unknown>>(data: T) {
  // return applyDecorators(
  //   ApiExtraModels(HttpPaginateSuccessResponse, data),
  //   ApiOkResponse({
  //     schema: {
  //       allOf: [
  //         { $ref: getSchemaPath(HttpPaginateSuccessResponse) },
  //         {
  //           properties: {
  //             data: {
  //               type: 'array',
  //               items: { $ref: getSchemaPath(data) },
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   }),
  // );
}
