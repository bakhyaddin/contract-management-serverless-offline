export enum ResponseStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

enum ErrorType {
  BAD_TOKEN = 'BadTokenError',
  TOKEN_EXPIRED = 'TokenExpiredError',
  UNAUTHORIZED = 'AuthFailureError',
  INTERNAL = 'InternalError',
  NO_DATA = 'NoDataError',
  BAD_REQUEST = 'BadRequestError',
  FORBIDDEN = 'ForbiddenError',
}

export abstract class ApiError extends Error {
  constructor(
    public type: ErrorType,
    public status: ResponseStatus,
    public message: string = 'error',
  ) {
    super(type);
  }

  public static handle(err: ApiError, res) {
    switch (err.type) {
      case ErrorType.INTERNAL:
        return res.internalServerError(err);
      case ErrorType.NO_DATA:
        return res.notFound(err);
      case ErrorType.BAD_TOKEN:
      case ErrorType.UNAUTHORIZED:
      case ErrorType.TOKEN_EXPIRED:
        return res.unauthorised(err);
      case ErrorType.BAD_REQUEST:
        return res.badRequest(err);
      case ErrorType.FORBIDDEN:
        return res.forbidden(err);
      default: {
        return res.internalServerError(err);
      }
    }
  }
}

export class AuthFailureError extends ApiError {
  constructor(message = 'Invalid Credentials') {
    super(ErrorType.UNAUTHORIZED, ResponseStatus.UNAUTHORIZED, message);
  }
}

export class InternalError extends ApiError {
  constructor(message = 'Internal error') {
    super(ErrorType.INTERNAL, ResponseStatus.INTERNAL_ERROR, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(ErrorType.BAD_REQUEST, ResponseStatus.BAD_REQUEST, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Permission denied') {
    super(ErrorType.FORBIDDEN, ResponseStatus.FORBIDDEN, message);
  }
}

export class BadTokenError extends ApiError {
  constructor(message = 'Token is not valid') {
    super(ErrorType.BAD_TOKEN, ResponseStatus.BAD_REQUEST, message);
  }
}

export class TokenExpiredError extends ApiError {
  constructor(message = 'Token is expired') {
    super(ErrorType.TOKEN_EXPIRED, ResponseStatus.UNAUTHORIZED, message);
  }
}

export class NoDataError extends ApiError {
  constructor(message = 'No data available') {
    super(ErrorType.NO_DATA, ResponseStatus.NOT_FOUND, message);
  }
}
