import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RegionalListReqDto,
  RegionalListSearchReqDto,
} from '../dto/regional-list.req.dto';
import { Village, VillageDocument } from '../schema/village.schema';
import { VillageDto } from '../dto/village.dto';
import { DATABASE_CONNECTION_NAME } from 'src/database/constants/database.constant';
import { RegionalService } from './regional.service';
import { DatabaseHelperQuerySearch } from 'src/database/decorators/db.decorator';

@Injectable()
export class VillageService extends RegionalService<
  Village,
  VillageDocument,
  VillageDto
> {
  constructor(
    @InjectModel(Village.name, DATABASE_CONNECTION_NAME)
    model: Model<Village>,
  ) {
    super(model, VillageDto);
  }

  async getVillages(district_id: number, queries: RegionalListReqDto) {
    const [total, list] = await Promise.all([
      await this.countList({ district_id }),
      await this.find({ district_id }, queries),
    ]);
    return this.mapList({
      list,
      total,
      queries,
    });
  }

  async getVillage(id: number) {
    const village = await this.findOne({ id });

    if (!village) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return this.mapOne(village);
  }

  async searchVillages(queries: RegionalListSearchReqDto) {
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
