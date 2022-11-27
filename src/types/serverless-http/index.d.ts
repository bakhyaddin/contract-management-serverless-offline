export {};

import { User } from '../../database/entities/user';
import { ApiResponse } from '../../core/ApiResponse';
import { ApiError } from '../../core/ApiError';
import { ErrorType, ResponseStatus } from '../../constants/api';

declare global {
  interface RequestSlsPress {
    event: EventSlsPress;
    err?: ApiError | Error;
  }

  interface ResponseBody<T> {
    status: ResponseStatus;
    message: string;
    data?: T;
  }

  interface ErrorBody {
    status: ResponseStatus;
    message: string;
    type: ErrorType;
  }

  interface ResponseSlsPress {
    send: <T>(status: number, body: ApiResponse) => ResponseBody<T>;
    ok: <T>(body: ApiResponse) => ResponseBody<T>;
    badRequest: (body: ApiError) => any;
    unauthorised: (body: ApiError) => any;
    forbidden: (body: ApiError) => any;
    notFound: (body: ApiError) => any;
    internalServerError: (body: ApiError) => any;
  }

  // copied from Express
  interface NextFunctionSlsPress {
    (err?: any): void;
    (deferToNext: 'router'): void;
    (deferToNext: 'route'): void;
  }

  interface EventSlsPress {
    body?: { [key: string]: string };
    user?: Omit<User, 'password'>;
    queryStringParameters?: { id: string };
    headers: { [key: string]: string };
  }
}
