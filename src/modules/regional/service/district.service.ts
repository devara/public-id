import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { District, DistrictDocument } from '../schema/district.schema';
import {
  RegionalListReqDto,
  RegionalListSearchReqDto,
} from '../dto/regional-list.req.dto';
import { DistrictDto } from '../dto/district.dto';
import { DATABASE_CONNECTION_NAME } from 'src/database/constants/database.constant';
import { RegionalService } from './regional.service';
import { DatabaseHelperQuerySearch } from 'src/database/decorators/db.decorator';

@Injectable()
export class DistrictService extends RegionalService<
  District,
  DistrictDocument,
  DistrictDto
> {
  constructor(
    @InjectModel(District.name, DATABASE_CONNECTION_NAME)
    model: Model<District>,
  ) {
    super(model, DistrictDto);
  }

  async getDistricts(regency_id: number, queries: RegionalListReqDto) {
    const [total, list] = await Promise.all([
      await this.countList({ regency_id }),
      await this.find({ regency_id }, queries),
    ]);
    return this.mapList({
      list,
      total,
      queries,
    });
  }

  async getDistrict(id: number) {
    const regency = await this.findOne({ id });

    if (!regency) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return this.mapOne(regency);
  }

  async searchDistricts(queries: RegionalListSearchReqDto) {
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
