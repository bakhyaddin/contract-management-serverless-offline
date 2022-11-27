import { ErrorType, ResponseStatus } from '../../../src/constants';
import { Contract } from '../../../src/database/entities/contract';
import { ContractFunctions } from '../../../src/functions/contract';
import { ContractService } from '../../../src/services/contract';
import { contractFixture, getMockedRequest } from '../../utils/fixtures';
const Response = require('../../../node_modules/slspress/lib/response.js');

let mockedResponse: typeof Response;

describe('Contract Functions', () => {
  beforeEach(() => {
    const mockResponseCallback = jest.fn((_, data) => data.body);
    mockedResponse = new Response(jest.fn(), mockResponseCallback, jest.fn(), {});
  });

  it('createContract', async () => {
    jest.spyOn(ContractService, 'create').mockReturnValue(Promise.resolve(contractFixture));

    const data = (await ContractFunctions.createContract(
      getMockedRequest({}),
      mockedResponse,
      jest.fn(),
    )) as ResponseBody<Contract>;

    expect(data.status).toBe(ResponseStatus.CREATED);
    expect(data.message).toBe('Contract created successfully');
    expect(data.data).toStrictEqual(contractFixture);
  });

  it('getContract success', async () => {
    jest.spyOn(ContractService, 'getContract').mockReturnValue(Promise.resolve(contractFixture));

    const data = (await ContractFunctions.getContract(
      getMockedRequest({ queryStringParameters: { id: '1' } }),
      mockedResponse,
      jest.fn(),
    )) as ResponseBody<Contract>;

    expect(data.status).toBe(ResponseStatus.SUCCESS);
    expect(data.message).toBe('Contract fetched successfully');
    expect(data.data).toStrictEqual(contractFixture);
  });

  it('getContract provide contract id error', async () => {
    const data = (await ContractFunctions.getContract(
      getMockedRequest({ queryStringParameters: undefined }),
      mockedResponse,
      jest.fn(),
    )) as ErrorBody;

    expect(data.status).toBe(ResponseStatus.BAD_REQUEST);
    expect(data.message).toBe('Please provide an id');
    expect(data.type).toStrictEqual(ErrorType.BAD_REQUEST);
  });

  it('getContract provide no contract error', async () => {
    jest.spyOn(ContractService, 'getContract').mockReturnValue(Promise.resolve(undefined));

    const data = (await ContractFunctions.getContract(
      getMockedRequest({ queryStringParameters: { id: '1' } }),
      mockedResponse,
      jest.fn(),
    )) as ErrorBody;

    expect(data.status).toBe(ResponseStatus.NOT_FOUND);
    expect(data.message).toBe('No contract found: 1');
    expect(data.type).toStrictEqual(ErrorType.NO_DATA);
  });

  it('getContract permission error', async () => {
    jest.spyOn(ContractService, 'getContract').mockReturnValue(Promise.resolve(contractFixture));

    const data = (await ContractFunctions.getContract(
      getMockedRequest({ queryStringParameters: { id: '1' }, userId: '2' }),
      mockedResponse,
      jest.fn(),
    )) as ErrorBody;

    expect(data.status).toBe(ResponseStatus.FORBIDDEN);
    expect(data.message).toBe('Not permitted to access contract: 1');
    expect(data.type).toStrictEqual(ErrorType.FORBIDDEN);
  });

  it('getContractIDs success', async () => {
    jest
      .spyOn(ContractService, 'getContractIds')
      .mockReturnValue(Promise.resolve([{ contractId: '1' }]));

    const data = (await ContractFunctions.getContractIds(
      getMockedRequest({ queryStringParameters: { id: '1' } }),
      mockedResponse,
      jest.fn(),
    )) as ResponseBody<[{ contractId: string }]>;

    expect(data.status).toBe(ResponseStatus.SUCCESS);
    expect(data.message).toBe('Contract IDs fetched successfully');
    expect(data.data).toStrictEqual([{ contractId: '1' }]);
  });

  it('getContractIDs no data error', async () => {
    jest.spyOn(ContractService, 'getContractIds').mockReturnValue(Promise.resolve([]));

    const data = (await ContractFunctions.getContractIds(
      getMockedRequest({ queryStringParameters: { id: '1' } }),
      mockedResponse,
      jest.fn(),
    )) as ErrorBody;

    expect(data.status).toBe(ResponseStatus.NOT_FOUND);
    expect(data.message).toBe('No contracts found');
    expect(data.type).toStrictEqual(ErrorType.NO_DATA);
  });
});
