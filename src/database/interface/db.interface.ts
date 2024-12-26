import type { Document, FilterQuery, QueryOptions } from 'mongoose';

export enum ENUM_PAGINATION_ORDER_DIRECTION_TYPE {
  ASC = 'asc',
  DESC = 'desc',
}

export type IDatabaseDocument<T> = T & Document;

export interface IDatabaseOptions<T> {
  find?: FilterQuery<T>;
  options?: QueryOptions;
  selects?: {
    [field in string & keyof T]?: number | boolean | string | object;
  };
  paging?: {
    limit: number;
    offset: number;
  };
  order?: {
    [field in string & keyof T]?: ENUM_PAGINATION_ORDER_DIRECTION_TYPE;
  };
  withDeleted?: boolean;
}

export interface IDatabaseQueryContainOptions {
  fullWord: boolean;
}
