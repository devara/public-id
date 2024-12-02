import { Module } from '@nestjs/common';
import { BaseModule } from './base/base.module';
import { RegionalModule } from './regional/regional.module';

@Module({
  imports: [BaseModule, RegionalModule],
})
export class ApiModule {}
