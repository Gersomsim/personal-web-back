import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const { message, data: responseData } = data as {
          message: string;
          data: any;
        };
        return {
          success: true,
          message: message,
          data: responseData,
          meta: {
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID(),
            path: context.switchToHttp().getRequest().url,
            method: context.switchToHttp().getRequest().method,
            status: context.switchToHttp().getResponse().statusCode,
          },
        };
      }),
    );
  }
}
