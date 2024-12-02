import { Expose } from 'class-transformer';
import { PaginationDto } from './pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedMetaDto {
  @Expose()
  @ApiProperty()
  readonly page: number;

  @Expose()
  @ApiProperty()
  readonly per_page: number;

  @Expose()
  @ApiProperty()
  readonly total?: number;

  @Expose()
  @ApiProperty()
  readonly prev_page?: number;

  @Expose()
  @ApiProperty()
  readonly next_page?: number;

  @Expose()
  @ApiProperty()
  readonly total_pages: number;

  constructor(totalRecords: number, pageOptions: PaginationDto) {
    this.page = pageOptions.page;
    this.per_page = pageOptions.per_page;
    this.total = totalRecords;

    this.total_pages =
      pageOptions.per_page > 0
        ? Math.ceil(totalRecords / pageOptions.per_page)
        : 0;

    this.next_page = this.page < this.total_pages ? this.page + 1 : undefined;
    this.prev_page =
      this.page > 1 && this.page - 1 < this.total_pages
        ? this.page - 1
        : undefined;
  }
}

export class PaginatedDto<T> {
  @Expose()
  @ApiProperty({ type: [Object] })
  readonly data: T[];

  @Expose()
  @ApiProperty()
  meta: PaginatedMetaDto;

  constructor(data: T[], meta: PaginatedMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
