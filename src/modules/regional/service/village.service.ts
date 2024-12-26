import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { RegionalListReqDto } from '../dto/regional-list.req.dto';
import { PaginatedDto, PaginatedMetaDto } from 'src/common/dto/paginated.dto';
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PER_PAGE,
} from 'src/constants/app.constant';
import { Village } from '../schema/village.schema';
import { VillageDto } from '../dto/village.dto';
import { DATABASE_CONNECTION_NAME } from 'src/database/constants/database.constant';

@Injectable()
export class VillageService {
  constructor(
    @InjectModel(Village.name, DATABASE_CONNECTION_NAME)
    private model: Model<Village>,
  ) {}

  async find(district_id: number, queryDto: RegionalListReqDto) {
    const { page = DEFAULT_CURRENT_PAGE, per_page = DEFAULT_PER_PAGE } =
      queryDto;
    const count = await this.model.countDocuments({ district_id }).lean();
    const villages = await this.model
      .find({ district_id })
      .limit(per_page)
      .skip(per_page * (page - 1))
      .lean();

    return new PaginatedDto(
      plainToInstance(VillageDto, villages),
      new PaginatedMetaDto(count, queryDto),
    );
  }

  async findOne(id: number) {
    const village = await this.model.findOne({ id }).lean();

    if (!village) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return plainToInstance(VillageDto, village);
  }
}
