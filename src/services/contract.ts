import { PutItemInput, ScanInput, GetItemInput } from 'aws-sdk/clients/dynamodb';
import { v4 } from 'uuid';

import { Contract } from '../database/entities/contract';
import dynamoDBClient from '../database/dynamodb';
import { contractsTableName } from '../constants';

export class ContractService {
  private static dynamoDBClient = dynamoDBClient();

  public static async create(
    userId: string,
    contractName: string,
    templateId: string,
  ): Promise<Contract> {
    const newContractId = v4();
    const newContract = Object.assign(new Contract(), {
      userId,
      contractName,
      templateId,
      contractId: newContractId,
    });

    const params: PutItemInput = {
      TableName: contractsTableName,
      // @ts-ignore
      Item: newContract,
    };

    await this.dynamoDBClient.put(params).promise();
    return newContract;
  }

  public static async getContractIds(userId: string): Promise<Array<{ contractId: string }>> {
    const params: ScanInput = {
      TableName: contractsTableName,
      ExpressionAttributeValues: {
        // @ts-ignore
        ':userId': userId,
      },
      FilterExpression: 'userId = :userId',
    };

    const contracts = (await this.dynamoDBClient.scan(params).promise())
      .Items as unknown as Contract[];

    return contracts.map((contract) => ({
      contractId: contract.contractId,
    }));
  }

  public static async getContract(id: string): Promise<Contract | undefined> {
    const params: GetItemInput = {
      TableName: contractsTableName,
      // @ts-ignore
      Key: { contractId: id },
    };

    const constract = await this.dynamoDBClient.get(params).promise();
    return constract.Item as unknown as Contract;
  }
}
