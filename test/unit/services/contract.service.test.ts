import { PutItemInput, GetItemInput, ScanInput } from 'aws-sdk/clients/dynamodb';
import { ErrorType, ResponseStatus } from '../../../src/constants';
import { InternalError } from '../../../src/core/ApiError';
import { ContractService } from '../../../src/services/contract';
import { contractFixture, userFixture } from '../../utils/fixtures';

const dynamodbAction = (data = null, resolve = true, errMsg = 'error') => {
  return {
    promise: () => (resolve ? Promise.resolve(data) : Promise.reject(new InternalError(errMsg))),
  };
};

const mockDynamoDBClient = {
  scan: (params: ScanInput) => jest.fn().mockReturnValue({ promise: jest.fn() }),
};

const contractService = ContractService;
// @ts-ignore
contractService.dynamoDBClient = mockDynamoDBClient;

describe('Contract service', () => {
  it('getContractIds has data', async () => {
    jest
      .spyOn(mockDynamoDBClient, 'scan')
      // @ts-ignore
      .mockReturnValue(dynamodbAction({ Items: [contractFixture] }));

    const data = await ContractService.getContractIds(userFixture.userId);
    expect(data).toHaveLength(1);
    expect(data[0].contractId).toBe('1');
  });

  it('getContractIds has no data', async () => {
    jest
      .spyOn(mockDynamoDBClient, 'scan')
      // @ts-ignore
      .mockReturnValue(dynamodbAction({ Items: [] }));

    const data = await ContractService.getContractIds(userFixture.userId);
    expect(data).toHaveLength(0);
  });

  it('getContractIds fails', async () => {
    jest
      .spyOn(mockDynamoDBClient, 'scan')
      // @ts-ignore
      .mockReturnValue(dynamodbAction({ Items: undefined }, false));

    try {
      await ContractService.getContractIds(userFixture.userId);
    } catch (err) {
      const { message, type, status } = err as InternalError;

      expect(type).toBe(ErrorType.INTERNAL);
      expect(status).toBe(ResponseStatus.INTERNAL_ERROR);
      expect(message).toBe('error');
    }
  });
});
