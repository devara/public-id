import {
  CreateOptions,
  type FilterQuery,
  Model,
  PopulateOptions,
  type QueryOptions,
  SaveOptions,
  type UpdateQuery,
} from 'mongoose';
import { DatabaseEntity } from './db.entity';
import { IDatabaseDocument, IDatabaseOptions } from '../interface/db.interface';

export class DatabaseRepository<
  Entity extends DatabaseEntity,
  EntityDocument extends IDatabaseDocument<Entity>,
> {
  protected readonly repository: Model<Entity>;
  readonly _join?: PopulateOptions | (string | PopulateOptions)[];

  constructor(
    respository: Model<Entity>,
    options?: PopulateOptions | (string | PopulateOptions)[],
  ) {
    this.repository = respository;
    this._join = options;
  }

  async findAll<T = EntityDocument>(
    options: IDatabaseOptions<T> = {},
  ): Promise<T[]> {
    const query = this.repository.find<T>({
      ...options.find,
      deleted: options?.withDeleted ?? false,
    });

    if (options?.selects) {
      query.select(options.selects);
    }

    if (options?.paging) {
      query.limit(options.paging.limit).skip(options.paging.offset);
    }

    if (options?.order) {
      query.sort(options.order);
    }

    if (options?.join) {
      query.populate(
        (typeof options.join === 'boolean' && options.join
          ? this._join
          : options.join) as PopulateOptions | (string | PopulateOptions)[],
      );
    }

    return query.exec();
  }

  async findOne<T = EntityDocument>(
    find: IDatabaseOptions<T>['find'],
    options?: IDatabaseOptions<T>,
  ): Promise<T> {
    const query = this.repository.findOne<T>({
      ...find,
      deleted: options?.withDeleted ?? false,
    });

    if (options?.selects) {
      query.select(options.selects);
    }

    return query.exec();
  }

  async findOneById<T = EntityDocument>(
    _id: string,
    options?: IDatabaseOptions<T>,
  ): Promise<T> {
    const query = this.repository.findOne<T>({
      _id,
      deleted: options?.withDeleted ?? false,
    });

    if (options?.selects) {
      query.select(options.selects);
    }

    return query.exec();
  }

  async findExists<T = EntityDocument>(
    find: IDatabaseOptions<T>['find'],
    options?: IDatabaseOptions<T>,
  ): Promise<boolean> {
    const query = this.repository.exists({
      ...find,
      deleted: options?.withDeleted ?? false,
    });

    const result = await query;
    return result ? true : false;
  }

  async count<T = EntityDocument>(options?: IDatabaseOptions<T>) {
    return this.repository
      .countDocuments({
        ...options?.find,
        deleted: options?.withDeleted ?? false,
      })
      .lean();
  }

  async create<T extends DatabaseEntity>(
    data: T,
    options?: CreateOptions,
  ): Promise<EntityDocument> {
    const created = await this.repository.create([data], options);

    return created[0] as any;
  }

  async updateOne(
    find: FilterQuery<Entity>,
    update: UpdateQuery<Entity>,
    options?: QueryOptions,
  ) {
    return this.repository.findOneAndUpdate(find, update, {
      ...options,
      new: true,
    });
  }

  async save(repository: EntityDocument, options?: SaveOptions) {
    return repository.save(options);
  }

  async deleteOneById(_id: string) {
    return this.repository.deleteOne({ _id });
  }
}
