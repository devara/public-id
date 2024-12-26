import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { RouterModule } from '../router/router.module';
import { CoreModule } from '../core/core.module';
import { WelcomeModule } from 'src/modules/welcome/welcome.module';

@Module({
  imports: [
    CoreModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 45,
      },
    ]),
    WelcomeModule,
    RouterModule,
  ],
})
export class AppModule {}
