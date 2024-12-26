import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { RouterModule } from '../router/router.module';
import { CoreModule } from '../core/core.module';
import { ApiModule } from 'src/api/api.module';

@Module({
  imports: [
    CoreModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 45,
      },
    ]),
    ApiModule,
    RouterModule,
  ],
})
export class AppModule {}
