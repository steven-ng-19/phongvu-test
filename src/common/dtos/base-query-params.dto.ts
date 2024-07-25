import {
  FilterOperationType,
  FilterOrder,
  GeneratedFindOptions,
  IFilter,
  IGeneratedFilter,
  ISingleFilter,
  ISingleOrder,
} from '@chax-at/prisma-filter';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

export class SingleFilter<T> implements ISingleFilter<T> {
  @IsString()
  field!: keyof T & string;

  @IsEnum(FilterOperationType)
  type!: FilterOperationType;

  @IsDefined()
  value!: any;
}

export class SingleFilterOrder<T> implements ISingleOrder<T> {
  @IsString()
  field!: keyof T & string;

  @IsIn(['asc', 'desc'])
  dir!: FilterOrder;
}

export class Filter<T> implements IFilter<T> {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleFilter)
  @IsOptional()
  filter?: ISingleFilter<T>[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleFilterOrder)
  @IsOptional()
  order?: ISingleOrder<T>[];

  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset = 0;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10;
}

export class BaseQueryParamsDto<TWhereInput>
  extends Filter<TWhereInput>
  implements IGeneratedFilter<TWhereInput>
{
  findOptions!: GeneratedFindOptions<TWhereInput>;
}
