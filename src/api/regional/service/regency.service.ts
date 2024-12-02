import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Regency } from '../schema/regency.schema';
import { RegionalListReqDto } from '../dto/regional-list.req.dto';
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PER_PAGE,
} from 'src/constants/app.constant';
import { PaginatedDto, PaginatedMetaDto } from 'src/common/dto/paginated.dto';
import { plainToInstance } from 'class-transformer';
import { RegencyDto } from '../dto/regency.dto';

@Injectable()
export class RegencyService {
  constructor(@InjectModel(Regency.name) private model: Model<Regency>) {}

  async find(province_id: number, queryDto: RegionalListReqDto) {
    const { page = DEFAULT_CURRENT_PAGE, per_page = DEFAULT_PER_PAGE } =
      queryDto;
    const count = await this.model.countDocuments({ province_id }).lean();
    const regencies = await this.model
      .find({ province_id })
      .limit(per_page)
      .skip(per_page * (page - 1))
      .lean();

    return new PaginatedDto(
      plainToInstance(RegencyDto, regencies),
      new PaginatedMetaDto(count, queryDto),
    );
  }

  async findOne(id: number) {
    const regency = await this.model.findOne({ id }).lean();

    if (!regency) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return plainToInstance(RegencyDto, regency);
  }
}
