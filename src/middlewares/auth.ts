import { AuthFailureError, BadRequestError, BadTokenError } from '../core/ApiError';
import asyncHandler from '../utils/asyncHandler';
import JWT from '../core/JWT';
import { UserService } from '../services/user';

export class AuthMiddleware {
  private static userService = UserService;

  public static jwtAuth = asyncHandler(
    async (
      req: RequestSlsPress,
      res: ResponseSlsPress,
      next: NextFunctionSlsPress,
    ): Promise<void> => {
      const { headers } = req.event!;
      const bearerToken = headers['Authorization'];
      if (!bearerToken) {
        throw new AuthFailureError('Missing "Authorization" header');
      }

      const [scheme, token] = bearerToken.trim().split(' ');
      if (scheme && token && /^Bearer$/i.test(scheme)) {
        const { username, userId } = await JWT.validate(token);
        const user = await this.userService.getUser(username);

        if (!user) {
          throw new BadRequestError(`User ${username} does not exist`);
        }

        req.event.user = { userId, username };
        return next();
      }

      throw new BadTokenError(
        'Bad Authorization header format. Format is "Authorization: Bearer <token>"',
      );
    },
  );
}
