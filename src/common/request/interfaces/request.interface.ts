import { type Request } from 'express';
import { type AuthJwtAccessPayloadDto } from 'src/modules/auth/dtos/jwt/auth.jwt.access-payload.dto';

export interface IRequestApp<T = AuthJwtAccessPayloadDto> extends Request {
  user?: T;
  workspace?: string;

  __language: string;
  __version: string;

  // __pagination?: ResponsePagingMetadataPaginationRequestDto;
}
