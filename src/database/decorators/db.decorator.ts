import type { Type } from '@nestjs/common';
import {
  InjectConnection,
  InjectModel,
  Prop,
  PropOptions,
  SchemaFactory,
} from '@nestjs/mongoose';
import { IDatabaseQueryContainOptions } from '../interface/db.interface';
import { DATABASE_CONNECTION_NAME } from '../constants/database.constant';

export function InjectDatabaseConnection(
  connectionName?: string,
): ParameterDecorator {
  return InjectConnection(connectionName ?? DATABASE_CONNECTION_NAME);
}

export function InjectDatabaseModel(
  entity: unknown & string,
  connectionName?: string,
): ParameterDecorator {
  return InjectModel(entity, connectionName ?? DATABASE_CONNECTION_NAME);
}

export function DatabaseSchema<T>(entity: Type<T>) {
  return SchemaFactory.createForClass(entity);
}

export function DatabaseProp(
  options?: PropOptions<unknown>,
): PropertyDecorator {
  return Prop(options);
}

export function DatabaseHelperQueryContain(
  field: string,
  value: string,
  options?: IDatabaseQueryContainOptions,
) {
  if (options?.fullWord) {
    return {
      [field]: {
        $regex: new RegExp(`\\b${value}\\b`),
        $options: 'i',
      },
    };
  }

  return {
    [field]: {
      $regex: new RegExp(value),
      $options: 'i',
    },
  };
}

export function DatabaseHelperQuerySearch(
  field: string,
  value: string,
  options?: IDatabaseQueryContainOptions,
) {
  if (options?.fullWord) {
    return {
      [field]: {
        $regex: new RegExp(`/${value}/`),
        $options: 'i',
      },
    };
  }

  return {
    [field]: {
      $regex: new RegExp(value),
      $options: 'i',
    },
  };
}
