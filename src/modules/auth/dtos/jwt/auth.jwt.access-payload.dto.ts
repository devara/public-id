import { ApiProperty } from '@nestjs/swagger';
import { ENUM_AUTH_LOGIN_FROM } from '../../enums/auth.enum';

export class AuthJwtAccessPayloadDto {
  @ApiProperty({
    required: true,
    nullable: false,
    example: new Date(),
  })
  loginDate: Date;

  @ApiProperty({
    required: true,
    nullable: false,
    enum: ENUM_AUTH_LOGIN_FROM,
  })
  loginFrom: ENUM_AUTH_LOGIN_FROM;

  @ApiProperty({
    required: true,
    nullable: false,
  })
  _id: string;

  @ApiProperty({
    required: true,
    nullable: false,
  })
  email: string;
}
