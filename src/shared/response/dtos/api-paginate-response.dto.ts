import { BaseQueryParamsDto, Filter } from 'src/common/dtos';

import { Request } from 'express';

export class ApiPaginateResponseInput<T> {
  count!: number;
  data!: T[];
  query!: Filter<T>;
  req?: Request;
}

export class ApiPaginateResponse<T> {
  next?: string | null;
  previous?: string | null;
  count!: number;
  results!: T[];
}
