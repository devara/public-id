import { applyDecorators, type Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  type ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto/paginated.dto';

export const PaginatedResponse = <T extends Type<unknown>>(options: {
  type: T;
  description?: string;
}): MethodDecorator => {
  return applyDecorators(
    ApiExtraModels(PaginatedDto, options.type),
    ApiOkResponse({
      description:
        options.description ?? `Paginated list of ${options.type.name}`,
      schema: {
        title: `PaginatedResponseOf${options.type.name}`,
        allOf: [
          {
            $ref: getSchemaPath(PaginatedDto),
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
