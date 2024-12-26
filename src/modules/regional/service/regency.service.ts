import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Regency, RegencyDocument } from '../schema/regency.schema';
import {
  RegionalListReqDto,
  RegionalListSearchReqDto,
} from '../dto/regional-list.req.dto';
import { RegencyDto } from '../dto/regency.dto';
import { DATABASE_CONNECTION_NAME } from 'src/database/constants/database.constant';
import { RegionalService } from './regional.service';
import { DatabaseHelperQuerySearch } from 'src/database/decorators/db.decorator';

@Injectable()
export class RegencyService extends RegionalService<
  Regency,
  RegencyDocument,
  RegencyDto
> {
  constructor(
    @InjectModel(Regency.name, DATABASE_CONNECTION_NAME)
    model: Model<Regency>,
  ) {
    super(model, RegencyDto);
  }

  async getRegencies(province_id: number, queries: RegionalListReqDto) {
    const [total, list] = await Promise.all([
      await this.countList({ province_id }),
      await this.find({ province_id }, queries),
    ]);
    return this.mapList({
      list,
      total,
      queries,
    });
  }

  async getRegency(id: number) {
    const regency = await this.findOne({ id });

    if (!regency) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return this.mapOne(regency);
  }

  async searchRegencies(queries: RegionalListSearchReqDto) {
    const { search } = queries;
    const searchQuery = DatabaseHelperQuerySearch('name', search);
    const [total, list] = await Promise.all([
      await this.countList(searchQuery),
      await this.find(searchQuery, queries),
    ]);

    return this.mapList({
      list,
      total,
      queries,
    });
  }
}
