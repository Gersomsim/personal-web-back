export class Response {
  static success<T>(
    data: T,
    message: string = '',
  ): { message: string; data: T } {
    return { message, data };
  }
}
