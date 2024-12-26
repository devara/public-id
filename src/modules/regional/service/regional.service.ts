import { FilterQuery, Model } from 'mongoose';
import { RegionalDto } from '../dto/regional.dto';
import {
  RegionalListReqDto,
  RegionalListSearchReqDto,
} from '../dto/regional-list.req.dto';
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PER_PAGE,
} from 'src/constants/app.constant';
import { IDatabaseDocument } from 'src/database/interface/db.interface';
import { PaginatedDto, PaginatedMetaDto } from 'src/common/dto/paginated.dto';
import { ClassConstructor, plainToInstance } from 'class-transformer';

interface MapDto<T> {
  list: T[];
  total: number;
  queries?: RegionalListReqDto | RegionalListSearchReqDto;
}

export abstract class RegionalService<
  Entity,
  EntityDocument extends IDatabaseDocument<Entity>,
  EntityDto extends RegionalDto,
> {
  protected readonly model: Model<Entity>;
  protected readonly dto: ClassConstructor<EntityDto>;

  constructor(model: Model<Entity>, dto: ClassConstructor<EntityDto>) {
    this.model = model;
    this.dto = dto;
  }

  async countList<T = EntityDocument>(
    find: FilterQuery<T> = {},
  ): Promise<number> {
    return await this.model.countDocuments(find).lean();
  }

  async find<T = EntityDocument>(
    find: FilterQuery<T> = {},
    reqDto: RegionalListReqDto | RegionalListSearchReqDto,
  ): Promise<T[]> {
    const { page = DEFAULT_CURRENT_PAGE, per_page = DEFAULT_PER_PAGE } = reqDto;

    return this.model
      .find<T>(find)
      .limit(per_page)
      .skip(per_page * (page - 1))
      .exec();
  }

  async findOne<T = EntityDocument>(find: FilterQuery<T> = {}): Promise<T> {
    return this.model.findOne<T>(find).exec();
  }

  async mapList<T = EntityDocument>({ list, total, queries }: MapDto<T>) {
    return new PaginatedDto(
      plainToInstance(this.dto, list),
      new PaginatedMetaDto(total, queries),
    );
  }

  async mapOne<T = EntityDocument>(item: T) {
    return plainToInstance(this.dto, item);
  }
}
