import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest();

    let status: number;
    let message: string;
    let code: string;
    let details: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, any>;
        message = responseObj.message || exception.message;
        details = responseObj.details;
      } else {
        message = exceptionResponse;
      }

      code = this.getErrorCode(status);
    } else {
      // Error no controlado
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error interno del servidor';
      code = 'INTERNAL_SERVER_ERROR';

      // Log del error completo para debugging

      this.logger.error(
        `Error no controlado: ${String(exception)}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }
    const errorResponse = {
      success: false,
      message,
      error: {
        code,
        details,
        statusCode: status,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
        path: request.url,
        method: request.method,
        status: status,
      },
    };

    // Cachear el error
    this.cacheError(errorResponse, request);
    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: number): string {
    const errorCodes = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
    };
    return errorCodes[status] || 'UNKNOWN_ERROR';
  }

  private cacheError(errorResponse: any, request: Request) {
    // Implementar lógica de caché aquí
    // Por ejemplo, usando Redis o un cache en memoria
    const errorKey = `error:${request.method}:${request.url}:${errorResponse.error?.statusCode}`;
    console.log(errorKey);
  }
}
