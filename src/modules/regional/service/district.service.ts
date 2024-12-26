import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { District } from '../schema/district.schema';
import { RegionalListReqDto } from '../dto/regional-list.req.dto';
import { PaginatedDto, PaginatedMetaDto } from 'src/common/dto/paginated.dto';
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PER_PAGE,
} from 'src/constants/app.constant';
import { DistrictDto } from '../dto/district.dto';
import { DATABASE_CONNECTION_NAME } from 'src/database/constants/database.constant';

@Injectable()
export class DistrictService {
  constructor(
    @InjectModel(District.name, DATABASE_CONNECTION_NAME)
    private model: Model<District>,
  ) {}

  async find(regency_id: number, queryDto: RegionalListReqDto) {
    const { page = DEFAULT_CURRENT_PAGE, per_page = DEFAULT_PER_PAGE } =
      queryDto;
    const count = await this.model.countDocuments({ regency_id }).lean();
    const districts = await this.model
      .find({ regency_id })
      .limit(per_page)
      .skip(per_page * (page - 1))
      .lean();

    return new PaginatedDto(
      plainToInstance(DistrictDto, districts),
      new PaginatedMetaDto(count, queryDto),
    );
  }

  async findOne(id: number) {
    const district = await this.model.findOne({ id }).lean();

    if (!district) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return plainToInstance(DistrictDto, district);
  }
}
