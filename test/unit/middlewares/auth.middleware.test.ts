import { ErrorType, ResponseStatus } from '../../../src/constants';
import JWT from '../../../src/core/JWT';
import { AuthMiddleware } from '../../../src/middlewares/auth';
import { UserService } from '../../../src/services/user';
import { getMockedRequest, userFixture } from '../../utils/fixtures';
const Response = require('../../../node_modules/slspress/lib/response.js');

let mockedResponse: typeof Response;

const authMiddleware = AuthMiddleware;
// @ts-ignore
authMiddleware.userService = UserService;

describe('Auth middleware', () => {
  beforeEach(() => {
    const mockResponseCallback = jest.fn((_, data) => data.body);
    mockedResponse = new Response(jest.fn(), mockResponseCallback, jest.fn(), {});
  });
  it('Authorization header is missing', async () => {
    const data = (await AuthMiddleware.jwtAuth(
      getMockedRequest({}),
      mockedResponse,
      jest.fn(),
    )) as ErrorBody;

    expect(data.message).toBe('Missing "Authorization" header');
    expect(data.status).toBe(ResponseStatus.UNAUTHORIZED);
    expect(data.type).toBe(ErrorType.UNAUTHORIZED);
  });

  it('Bad token error', async () => {
    const data = (await AuthMiddleware.jwtAuth(
      getMockedRequest({ headers: { Authorization: 'sometoken' } }),
      mockedResponse,
      jest.fn(),
    )) as ErrorBody;

    expect(data.message).toBe(
      'Bad Authorization header format. Format is "Authorization: Bearer <token>"',
    );
    expect(data.status).toBe(ResponseStatus.BAD_REQUEST);
    expect(data.type).toBe(ErrorType.BAD_TOKEN);
  });

  it('User not found error', async () => {
    jest.spyOn(UserService, 'getUser').mockReturnValue(Promise.resolve(undefined));

    const token = await JWT.encode({ username: userFixture.username, userId: userFixture.userId });
    const data = (await AuthMiddleware.jwtAuth(
      getMockedRequest({ headers: { Authorization: `Bearer ${token}` } }),
      mockedResponse,
      jest.fn(),
    )) as ErrorBody;

    expect(data.message).toBe(`User ${userFixture.username} does not exist`);
    expect(data.status).toBe(ResponseStatus.BAD_REQUEST);
    expect(data.type).toBe(ErrorType.BAD_REQUEST);
  });

  it('Happy path', async () => {
    const userId = '2';
    jest.spyOn(UserService, 'getUser').mockReturnValue(Promise.resolve({ ...userFixture, userId }));
    const token = await JWT.encode({ username: userFixture.username, userId });
    const request = getMockedRequest({ headers: { Authorization: `Bearer ${token}` } });

    await AuthMiddleware.jwtAuth(request, mockedResponse, jest.fn());

    expect(request.event.user?.userId).toBe(userId);
    expect(request.event.user?.username).toBe(userFixture.username);
  });
});
