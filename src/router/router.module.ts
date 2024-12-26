import { Module } from '@nestjs/common';
import { RoutesPublicModule } from './routes/route.public.module';
import { RoutesSharedModule } from './routes/route.shared.module';
import { RegionalModule } from 'src/modules/regional/regional.module';

@Module({
  imports: [RegionalModule, RoutesPublicModule, RoutesSharedModule],
})
export class RouterModule {}
