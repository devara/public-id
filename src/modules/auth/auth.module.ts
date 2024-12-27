import { DynamicModule, Module } from '@nestjs/common';
import { AuthJwtAccessStrategy } from './guards/jwt/auth.jwt.access.strategy';
import { AuthService } from './services/auth.service';
import { AuthJwtRefreshStrategy } from './guards/jwt/auth.jwt.refresh.strategy';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  imports: [],
})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      providers: [AuthJwtAccessStrategy, AuthJwtRefreshStrategy],
      exports: [],
    };
  }
}
