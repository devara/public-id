import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../interceptors/response.interceptor';

export function Response(): MethodDecorator {
  const decorators = [UseInterceptors(ResponseInterceptor)];

  return applyDecorators(...decorators);
}
