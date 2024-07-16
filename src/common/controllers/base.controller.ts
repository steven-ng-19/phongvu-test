import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpErrorResponse, HttpSuccessResponse } from '../responses';

@ApiOkResponse({ type: HttpSuccessResponse })
@ApiBadRequestResponse({ type: HttpErrorResponse })
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: HttpErrorResponse,
})
export class BaseController {}
