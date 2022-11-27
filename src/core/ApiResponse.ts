import { ResponseStatus } from '../constants';

export abstract class ApiResponse {
  constructor(protected status: ResponseStatus, protected message: string, protected data?: any) {}

  private sanitize<T extends ApiResponse>(response: T): T {
    const clone: T = {} as T;
    Object.assign(clone, response);
    for (const i in clone)
      if (typeof clone[i] === 'undefined' || typeof clone[i] === 'function') delete clone[i];
    return clone;
  }

  public send<T>(res: ResponseSlsPress): ResponseBody<T> {
    return res.send(this.status, this.sanitize(this));
  }
}

export class SuccessResponse<T> extends ApiResponse {
  constructor(message: string, data: T) {
    super(ResponseStatus.SUCCESS, message, data);
  }
}

export class CreatedResponse<T> extends ApiResponse {
  constructor(message: string, data: T) {
    super(ResponseStatus.CREATED, message, data);
  }
}
