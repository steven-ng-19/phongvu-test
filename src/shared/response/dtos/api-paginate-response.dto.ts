import { BaseQueryParams } from 'src/common/dtos/base-query-params.dto';
import { Request } from 'express';

export class ApiPaginateResponseInput<T> {
  count: number;
  data: T[];
  query?: BaseQueryParams;
  req?: Request;
}

export class ApiPaginateResponse<T> {
  next?: string;
  previous?: string;
  count: number;
  results: T[];
}
