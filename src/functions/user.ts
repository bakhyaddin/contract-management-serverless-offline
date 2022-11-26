import { SuccessResponse } from '../core/ApiResponse';
import { NoDataError, InternalError, BadRequestError } from '../core/ApiError';
import bcrypt from 'bcryptjs';

import { UserService } from '../services/user';
import { User } from '../database/entities/user';
import JWT from '../core/JWT';

import errorHandler from '../utils/errorHandler';

export class UserFunctions {
  public static createUser = errorHandler(async (req, res) => {
    const body = req.event.body;
    const { username, password } = body;

    let user = await UserService.getUser(username);
    if (user) {
      throw new BadRequestError('User already exists');
    }

    user = await UserService.createUser(username, password);

    console.log({ user });

    return new SuccessResponse('User created successfully', {
      user,
    }).send(res);
  });

  public static loginUser = errorHandler(async (req, res): Promise<User & { token: string }> => {
    const body = req.event.body;
    const { username, password } = body;

    const user = await UserService.getUser(username);
    if (!user) {
      throw new NoDataError('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new BadRequestError('Invalid password');
    }

    return new SuccessResponse('User logged in', {
      username: user.username,
      userId: user.userId,
      token: await JWT.encode({ username: user.username, userId: user.userId }),
    }).send(res);
  });
}
