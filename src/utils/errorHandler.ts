import { ApiError, InternalError } from '../core/ApiError';

export default (execution) => (req, res, next) =>
  execution(req, res, next).catch((err) => {
    if (err instanceof ApiError) {
      return ApiError.handle(err, res);
    } else {
      return ApiError.handle(new InternalError(err?.message), res);
    }
  });
