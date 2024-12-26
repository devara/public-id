import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Province, ProvinceDocument } from '../schema/province.schema';
import {
  RegionalListReqDto,
  RegionalListSearchReqDto,
} from '../dto/regional-list.req.dto';
import { ProvinceDto } from '../dto/province.dto';
import { DATABASE_CONNECTION_NAME } from 'src/database/constants/database.constant';
import { DatabaseHelperQuerySearch } from 'src/database/decorators/db.decorator';
import { RegionalService } from './regional.service';
// import { Type } from 'class-transformer';

@Injectable()
export class ProvinceService extends RegionalService<
  Province,
  ProvinceDocument,
  ProvinceDto
> {
  constructor(
    @InjectModel(Province.name, DATABASE_CONNECTION_NAME)
    model: Model<Province>,
  ) {
    super(model, ProvinceDto);
  }

  async getProvinces(queries: RegionalListReqDto) {
    const [total, list] = await Promise.all([
      await this.countList(),
      await this.find({}, queries),
    ]);
    return this.mapList({
      list,
      total,
      queries,
    });
  }

  async getProvince(id: number) {
    const province = await this.findOne({ id });

    if (!province) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return this.mapOne(province);
  }

  async searchProvinces(queries: RegionalListSearchReqDto) {
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
