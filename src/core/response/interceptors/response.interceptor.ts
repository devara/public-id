import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ResponseDto } from '../dtos/response.dto';
import { Reflector } from '@nestjs/core';
import { HelperDateService } from 'src/core/helper/services/helper.date.service';
import { map, Observable } from 'rxjs';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';

@Injectable()
export class ResponseInterceptor
  implements NestInterceptor<Promise<ResponseDto>>
{
  constructor(
    private readonly reflector: Reflector,
    private readonly dateService: HelperDateService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<ResponseDto>> {
    if (context.getType() === 'http') {
      return next.handle().pipe(
        map(async (res: Promise<any>) => {
          const ctx: HttpArgumentsHost = context.switchToHttp();
          const response: Response = ctx.getResponse();
          const request = ctx.getRequest();
          // set default response
          const httpStatus: HttpStatus = response.statusCode;
          const statusCode: number = response.statusCode;
          let data: Record<string, any> = undefined;

          const today = this.dateService.create();
          const timezone = this.dateService.getZone(today);
          const timestamp = this.dateService.getTimestamp(today);

          const responseData = await res;
          if (responseData) {
            data = responseData.data;
          }

          response.header('X-Timezone', timezone);
          response.header('X-Timestamp', timestamp as unknown as string);
          response.header('X-Request-Path', request.url);

          return {
            statusCode,
            // message,
            data,
          };
        }),
      );
    }
    return next.handle();
  }
}
