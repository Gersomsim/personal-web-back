import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { PaginationMeta } from 'src/shared/interfaces';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const {
          message,
          data: responseData,
          pagination,
        } = data as {
          message: string;
          data: any;
          pagination?: PaginationMeta;
        };
        return {
          success: true,
          message: message,
          data: responseData,
          meta: {
            method: context.switchToHttp().getRequest().method,
            pagination,
            path: context.switchToHttp().getRequest().url,
            requestId: crypto.randomUUID(),
            status: context.switchToHttp().getResponse().statusCode,
            timestamp: new Date().toISOString(),
          },
        };
      }),
    );
  }
}
