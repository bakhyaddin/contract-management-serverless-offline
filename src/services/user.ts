import { GetItemInput, PutItemInput } from 'aws-sdk/clients/dynamodb';
import { v4 } from 'uuid';
import bcrypt from 'bcryptjs';

import { User } from '../database/entities/user';

import dynamoDBClient from '../database/dynamodb';
import { usersTableName } from '../constants';

export class UserService {
  private static dynamoDBClient = dynamoDBClient();

  public static async getUser(username: string): Promise<User | undefined> {
    const params: GetItemInput = {
      TableName: usersTableName,
      // @ts-ignore
      Key: { username },
    };

    const user = await this.dynamoDBClient.get(params).promise();
    return user.Item as unknown as User;
  }

  public static async createUser(username: string, password: string): Promise<User> {
    const userId = v4();
    const hashedPassword = await bcrypt.hash(password, 12);
    const userParams: User = { username, userId, password: hashedPassword };

    const params: PutItemInput = {
      TableName: usersTableName,
      // @ts-ignore
      Item: userParams,
    };

    await this.dynamoDBClient.put(params).promise();
    return userParams;
  }
}
