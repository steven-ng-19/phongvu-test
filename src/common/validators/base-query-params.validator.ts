import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants';

import { z } from 'zod';

export const BaseQuerySortSchema = z
  .record(z.string().trim(), z.enum(['asc', 'desc']).default('asc'))
  .optional();

export const BaseQueryParamsValidator = z
  .object({
    noPagination: z.boolean().default(false),
    page: z.number().int().min(1).default(DEFAULT_PAGE).optional(),
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .default(DEFAULT_PAGE_SIZE)
      .optional(),
    search: z.string().trim().optional(),
    sort: BaseQuerySortSchema,
  })
  .strip();
