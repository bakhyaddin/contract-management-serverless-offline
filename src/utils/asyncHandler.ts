import { ApiError, InternalError } from '../core/ApiError';

type AsyncFunction<T> = (
  req: RequestSlsPress,
  res: ResponseSlsPress,
  next: NextFunctionSlsPress,
) => Promise<T>;

export default <T>(execution: AsyncFunction<T>) =>
  (
    req: RequestSlsPress,
    res: ResponseSlsPress,
    next: NextFunctionSlsPress,
  ): Promise<T | ErrorBody> =>
    execution(req, res, next).catch((err: ApiError | Error) => {
      if (err instanceof ApiError) {
        return ApiError.handle(err, res);
      } else {
        return ApiError.handle(new InternalError(err?.message), res);
      }
    });
