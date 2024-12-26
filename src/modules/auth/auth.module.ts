import { DynamicModule, Module } from '@nestjs/common';
import { AuthJwtAccessStrategy } from './guards/jwt/auth.jwt.access.strategy';
import { AuthService } from './services/auth.service';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  imports: [],
})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      providers: [AuthJwtAccessStrategy],
      exports: [],
    };
  }
}
