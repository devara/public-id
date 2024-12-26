import { applyDecorators, type Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  type ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export const PaginatedResponse = <T extends Type<unknown>>(options: {
  type: T;
  description?: string;
}): MethodDecorator => {
  return applyDecorators(
    ApiExtraModels(PaginationDto, options.type),
    ApiOkResponse({
      description:
        options.description ?? `Paginated list of ${options.type.name}`,
      schema: {
        title: `PaginatedResponseOf${options.type.name}`,
        allOf: [
          {
            $ref: getSchemaPath(PaginationDto),
          },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              },
            },
          },
        ],
      },
    } as ApiResponseOptions | undefined),
  );
};
