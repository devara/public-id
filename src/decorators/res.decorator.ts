import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  type Type,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { STATUS_CODES } from 'http';
import { PaginatedResponse } from './res.paginate.decorator';

type ApiResponseType = number;

interface ApiOptions<T extends Type<unknown>> {
  type?: T;
  summary?: string;
  description?: string;
  errorResponses?: ApiResponseType[];
  statusCode?: HttpStatus;
  isPaginated?: boolean;
}

type ApiPublicOptions = ApiOptions<Type<unknown>>;

const errorResponsesType = [
  HttpStatus.BAD_REQUEST,
  HttpStatus.FORBIDDEN,
  HttpStatus.NOT_FOUND,
  HttpStatus.UNPROCESSABLE_ENTITY,
  HttpStatus.INTERNAL_SERVER_ERROR,
];

export const ApiPublicResponse = (
  options: ApiPublicOptions = {},
): MethodDecorator => {
  const defaultStatusCode = HttpStatus.OK;
  const defaultErrorResponses = errorResponsesType;

  const successResponse = {
    type: options.type,
    description: options?.description ?? 'OK',
  };

  const errorResponses = (
    options?.errorResponses ?? defaultErrorResponses
  )?.map((statusCode) =>
    ApiResponse({
      status: statusCode,
      description: STATUS_CODES[statusCode],
    }),
  );

  return applyDecorators(
    ApiOperation({ summary: options?.summary }),
    HttpCode(options.statusCode ?? defaultStatusCode),
    options?.isPaginated
      ? PaginatedResponse(successResponse)
      : ApiOkResponse(successResponse),
    ...errorResponses,
  );
};
