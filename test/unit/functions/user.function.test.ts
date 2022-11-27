import { ErrorType, ResponseStatus } from '../../../src/constants';
import JWT from '../../../src/core/JWT';
import { User } from '../../../src/database/entities/user';
import { UserFunctions } from '../../../src/functions/user';
import { UserService } from '../../../src/services/user';
import { getMockedRequest, userFixture } from '../../utils/fixtures';
import bcrypt from 'bcryptjs';
const Response = require('../../../node_modules/slspress/lib/response.js');

let mockedResponse: typeof Response;

describe('User Functions', () => {
  beforeEach(() => {
    const mockResponseCallback = jest.fn((_, data) => data.body);
    mockedResponse = new Response(jest.fn(), mockResponseCallback, jest.fn(), {});
  });

  it('createUser success', async () => {
    jest.spyOn(UserService, 'getUser').mockReturnValue(Promise.resolve(undefined));
    jest.spyOn(UserService, 'createUser').mockReturnValue(Promise.resolve(userFixture));

    const data = (await UserFunctions.createUser(
      getMockedRequest({}),
      mockedResponse,
      jest.fn(),
    )) as ResponseBody<User>;

    expect(data.status).toBe(ResponseStatus.CREATED);
    expect(data.message).toBe('User created successfully');
    expect(data.data).toStrictEqual({ username: userFixture.username, userId: userFixture.userId });
  });

  it('createUser user already exist error', async () => {
    jest.spyOn(UserService, 'getUser').mockReturnValue(Promise.resolve(userFixture));

    const data = (await UserFunctions.createUser(
      getMockedRequest({}),
      mockedResponse,
      jest.fn(),
    )) as ErrorBody;

    expect(data.status).toBe(ResponseStatus.BAD_REQUEST);
    expect(data.message).toBe('User already exists');
    expect(data.type).toStrictEqual(ErrorType.BAD_REQUEST);
  });

  it('loginUser success', async () => {
    jest
      .spyOn(UserService, 'getUser')
      .mockReturnValue(
        Promise.resolve({ ...userFixture, password: await bcrypt.hash(userFixture.password, 12) }),
      );

    const data = (await UserFunctions.loginUser(
      getMockedRequest({}),
      mockedResponse,
      jest.fn(),
    )) as ResponseBody<Omit<User, 'password'> & { token: string }>;

    expect(data.status).toBe(ResponseStatus.SUCCESS);
    expect(data.message).toBe('User logged in');
    expect(data.data).toStrictEqual({
      username: userFixture.username,
      userId: userFixture.userId,
      token: await JWT.encode({ username: data.data!.username, userId: data.data!.userId }),
    });
  });

  it('loginUser user not found error', async () => {
    jest.spyOn(UserService, 'getUser').mockReturnValue(Promise.resolve(undefined));

    const data = (await UserFunctions.loginUser(
      getMockedRequest({}),
      mockedResponse,
      jest.fn(),
    )) as ErrorBody;

    expect(data.status).toBe(ResponseStatus.NOT_FOUND);
    expect(data.message).toBe('User not found');
    expect(data.type).toStrictEqual(ErrorType.NO_DATA);
  });

  it('loginUser invalid password error', async () => {
    jest.spyOn(UserService, 'getUser').mockReturnValue(
      Promise.resolve({
        ...userFixture,
        password: await bcrypt.hash(userFixture.password + '3', 12),
      }),
    );

    const data = (await UserFunctions.loginUser(
      getMockedRequest({}),
      mockedResponse,
      jest.fn(),
    )) as ErrorBody;

    expect(data.status).toBe(ResponseStatus.BAD_REQUEST);
    expect(data.message).toBe('Invalid password');
    expect(data.type).toStrictEqual(ErrorType.BAD_REQUEST);
  });
});
