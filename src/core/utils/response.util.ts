import { PaginationMeta } from 'src/shared/interfaces';

export class Response {
  static success<T>(
    data: T,
    message: string = '',
    pagination?: PaginationMeta,
  ): { message: string; data: T; pagination?: any } {
    return { message, data, pagination };
  }
}
