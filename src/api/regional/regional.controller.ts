import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProvinceService } from './service/province.service';
import { RegencyService } from './service/regency.service';
import { DistrictService } from './service/district.service';
import { RegionalListReqDto } from './dto/regional-list.req.dto';
import { VillageService } from './service/village.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ProvinceDto } from './dto/province.dto';
import { RegencyDto } from './dto/regency.dto';
import { DistrictDto } from './dto/district.dto';
import { VillageDto } from './dto/village.dto';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { ApiPublicResponse } from 'src/decorators/res.decorator';

@ApiTags('Regional Indonesia')
@Controller({
  path: 'regional',
})
export class RegionalController {
  constructor(
    private readonly provinceService: ProvinceService,
    private readonly regencyService: RegencyService,
    private readonly districtService: DistrictService,
    private readonly villageService: VillageService,
  ) {}

  @Get('/provinces')
  @ApiPublicResponse({
    type: ProvinceDto,
    isPaginated: true,
    summary: 'Get List of Province',
  })
  async findProvinces(
    @Query() queryParams: RegionalListReqDto,
  ): Promise<PaginatedDto<ProvinceDto>> {
    return this.provinceService.find(queryParams);
  }

  @Get('/province/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiPublicResponse({
    type: ProvinceDto,
    summary: 'Get Detail of Province',
  })
  async findProvince(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProvinceDto> {
    return await this.provinceService.findOne(id);
  }

  @Get('/regencies/:provinceID')
  @ApiParam({ name: 'provinceID', description: 'Province ID from Regency' })
  @ApiPublicResponse({
    type: RegencyDto,
    isPaginated: true,
    summary: 'Get List of Regencies from x Province',
  })
  async findRegenciesByProvinceId(
    @Param('provinceID', ParseIntPipe)
    provinceID: number,
    @Query() queryParams: RegionalListReqDto,
  ) {
    return this.regencyService.find(provinceID, queryParams);
  }

  @Get('/regency/:id')
  @ApiPublicResponse({
    type: RegencyDto,
    summary: 'Get Detail of Regency',
  })
  async findRegency(@Param('id', ParseIntPipe) id: number) {
    return this.regencyService.findOne(id);
  }

  @Get('/districts/:regencyID')
  @ApiPublicResponse({
    type: DistrictDto,
    isPaginated: true,
    summary: 'Get List of Districts from x Regency',
  })
  async findDistrictsByRegency(
    @Param('regencyID', ParseIntPipe)
    regencyID: number,
    @Query() queryParams: RegionalListReqDto,
  ) {
    return this.districtService.find(regencyID, queryParams);
  }

  @Get('/district/:id')
  @ApiPublicResponse({
    type: DistrictDto,
    summary: 'Get Detail of District',
  })
  async findDistrict(@Param('id', ParseIntPipe) id: number) {
    return this.districtService.findOne(id);
  }

  @Get('/villages/:districtID')
  @ApiPublicResponse({
    type: VillageDto,
    isPaginated: true,
    summary: 'Get List of Villages from x District',
  })
  async findVillagesByDistrict(
    @Param('districtID', ParseIntPipe)
    districtID: number,
    @Query() queryParams: RegionalListReqDto,
  ) {
    return this.villageService.find(districtID, queryParams);
  }

  @Get('/village/:id')
  @ApiPublicResponse({
    type: VillageDto,
    summary: 'Get Detail of Village',
  })
  async findVillage(@Param('id', ParseIntPipe) id: number) {
    return this.villageService.findOne(id);
  }
}
