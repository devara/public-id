import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { Province } from '../schema/province.schema';
import { RegionalListReqDto } from '../dto/regional-list.req.dto';
import { ProvinceDto } from '../dto/province.dto';
import { PaginatedDto, PaginatedMetaDto } from 'src/common/dto/paginated.dto';
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PER_PAGE,
} from 'src/constants/app.constant';
import { DATABASE_CONNECTION_NAME } from 'src/database/constants/database.constant';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectModel(Province.name, DATABASE_CONNECTION_NAME)
    private model: Model<Province>,
  ) {}

  async find(queryDto: RegionalListReqDto) {
    const { page = DEFAULT_CURRENT_PAGE, per_page = DEFAULT_PER_PAGE } =
      queryDto;
    const all = await this.model.countDocuments().lean();
    const provinces = await this.model
      .find()
      .limit(per_page)
      .skip(per_page * (page - 1))
      .lean();

    return new PaginatedDto(
      plainToInstance(ProvinceDto, provinces),
      new PaginatedMetaDto(all, queryDto),
    );
  }

  async findOne(id: number) {
    const province = await this.model.findOne({ id }).lean();

    if (!province) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return plainToInstance(ProvinceDto, province);
  }
}
