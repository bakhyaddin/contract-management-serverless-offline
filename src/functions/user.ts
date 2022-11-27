import { CreatedResponse, SuccessResponse } from '../core/ApiResponse';
import { NoDataError, BadRequestError } from '../core/ApiError';
import bcrypt from 'bcryptjs';

import { UserService } from '../services/user';
import { User } from '../database/entities/user';
import JWT from '../core/JWT';

import asyncHandler from '../utils/asyncHandler';

export class UserFunctions {
  public static createUser = asyncHandler(
    async (
      req: RequestSlsPress,
      res: ResponseSlsPress,
    ): Promise<ResponseBody<Omit<User, 'password'>>> => {
      const { username, password } = req.event.body!;

      let user = await UserService.getUser(username);
      if (user) {
        throw new BadRequestError('User already exists');
      }

      user = await UserService.createUser(username, password);

      return new CreatedResponse<Omit<User, 'password'>>('User created successfully', {
        username: user.username,
        userId: user.userId,
      }).send(res);
    },
  );

  public static loginUser = asyncHandler(
    async (
      req: RequestSlsPress,
      res: ResponseSlsPress,
    ): Promise<ResponseBody<Omit<User, 'password'> & { token: string }>> => {
      const { username, password } = req.event.body!;

      const user = await UserService.getUser(username);
      if (!user) {
        throw new NoDataError('User not found');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new BadRequestError('Invalid password');
      }

      return new SuccessResponse<Omit<User, 'password'> & { token: string }>('User logged in', {
        username: user.username,
        userId: user.userId,
        token: await JWT.encode({ username: user.username, userId: user.userId }),
      }).send(res);
    },
  );
}
