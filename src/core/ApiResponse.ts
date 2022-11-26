import { ResponseStatus } from './ApiError';

abstract class ApiResponse {
  constructor(protected status: ResponseStatus, protected message: string, protected data?: any) {}

  public send = (res) => {
    return res.ok(this);
  };
}

export class SuccessResponse<T> extends ApiResponse {
  constructor(message: string, data: T) {
    super(ResponseStatus.SUCCESS, message, data);
  }
}
