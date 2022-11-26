import { PutItemInput, ScanInput, GetItemInput } from 'aws-sdk/clients/dynamodb';
import { v4 } from 'uuid';

import { Contract } from '../database/entities/contract';
import dynamoDBClient from '../database/dynamodb';

export class ContractService {
  private static dynamoDBClient = dynamoDBClient();
  private static constactTableName = process.env.CONTRACTS_TABLE_NAME!;

  public static async create(userId: string, contractName: string, templateId: string) {
    const newContractId = v4();
    const newContract = Object.assign(new Contract(), {
      userId,
      contractName,
      templateId,
      contractId: newContractId,
    });

    const params: PutItemInput = {
      TableName: this.constactTableName,
      // @ts-ignore
      Item: newContract,
    };

    await this.dynamoDBClient.put(params).promise();
    return newContract;
  }

  public static async getContractIds(userId: string) {
    const params: ScanInput = {
      TableName: this.constactTableName!,
      ExpressionAttributeValues: {
        // @ts-ignore
        ':userId': userId,
      },
      FilterExpression: 'userId = :userId',
    };

    const contracts = (await dynamoDBClient().scan(params).promise())
      .Items as unknown as Contract[];
    return contracts.map((contract) => ({
      contractId: contract.contractId,
    }));
  }

  public static async getContract(id: string) {
    const params: GetItemInput = {
      TableName: this.constactTableName!,
      // @ts-ignore
      Key: { contractId: id },
    };

    const constract = await this.dynamoDBClient.get(params).promise();
    return constract.Item as unknown as Contract;
  }
}
