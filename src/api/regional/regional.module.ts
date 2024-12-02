import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Province, ProvinceSchema } from './schema/province.schema';
import { Regency, RegencySchema } from './schema/regency.schema';
import { ProvinceService } from './service/province.service';
import { RegencyService } from './service/regency.service';
import { RegionalController } from './regional.controller';
import { DistrictService } from './service/district.service';
import { District, DistrictSchema } from './schema/district.schema';
import { Village, VillageSchema } from './schema/village.schema';
import { VillageService } from './service/village.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Province.name,
        schema: ProvinceSchema,
      },
      {
        name: Regency.name,
        schema: RegencySchema,
      },
      {
        name: District.name,
        schema: DistrictSchema,
      },
      {
        name: Village.name,
        schema: VillageSchema,
      },
    ]),
  ],
  controllers: [RegionalController],
  providers: [ProvinceService, RegencyService, DistrictService, VillageService],
})
export class RegionalModule {}
