import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty({
    name: 'statusCode',
    type: 'number',
    required: true,
    nullable: false,
    description: 'return specific status code for every endpoints',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    name: 'message',
    required: false,
    nullable: false,
    description: 'Message base on language',
    type: 'string',
    example: 'message endpoint',
  })
  message?: string;

  @ApiHideProperty()
  data?: Record<string, any>;
}
