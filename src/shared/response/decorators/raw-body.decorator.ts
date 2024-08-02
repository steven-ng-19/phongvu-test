import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';

export const RawBody = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    console.log(request.rawBody);
    return request.rawBody;
  },
);
