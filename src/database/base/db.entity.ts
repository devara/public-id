import { v4 as uuidV4 } from 'uuid';
import { DatabaseProp } from '../decorators/db.decorator';

export class DatabaseEntity {
  @DatabaseProp({
    type: String,
    default: uuidV4,
  })
  _id: string;

  @DatabaseProp({
    required: true,
    index: true,
    default: false,
  })
  deleted: boolean;

  @DatabaseProp({
    required: false,
    type: Date,
    default: new Date(),
  })
  createdAt?: Date;

  @DatabaseProp({
    required: false,
    type: Date,
    default: new Date(),
  })
  updatedAt?: Date;

  @DatabaseProp({
    required: false,
    type: Date,
  })
  deletedAt?: Date;
}
