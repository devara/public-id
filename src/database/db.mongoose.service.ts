import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { AvailableConfigType } from '../config/config.type';

@Injectable()
export class MongooseService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService<AvailableConfigType>) {}

  createMongooseOptions():
    | Promise<MongooseModuleOptions>
    | MongooseModuleOptions {
    return {
      uri: this.configService.getOrThrow('database.url', { infer: true }),
      dbName: this.configService.getOrThrow('database.name', { infer: true }),
      user: this.configService.getOrThrow('database.username', { infer: true }),
      pass: this.configService.getOrThrow('database.password', { infer: true }),
    };
  }
}
