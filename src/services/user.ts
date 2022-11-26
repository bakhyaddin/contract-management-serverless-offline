import { GetItemInput, PutItemInput } from 'aws-sdk/clients/dynamodb';
import { v4 } from 'uuid';
import bcrypt from 'bcryptjs';

import { User } from '../database/entities/user';

import dynamoDBClient from '../database/dynamodb';

export class UserService {
  private static dynamoDBClient = dynamoDBClient();
  private static userTableName = process.env.USERS_TABLE_NAME!;

  public static async getUser(username: string): Promise<User> {
    const params: GetItemInput = {
      TableName: this.userTableName!,
      // @ts-ignore
      Key: { username },
    };

    const user = await this.dynamoDBClient.get(params).promise();
    return user.Item as unknown as User;
  }

  public static async createUser(username: string, password: string): Promise<User> {
    const userId = v4();
    const hashedPassword = await bcrypt.hash(password, 12);

    const params: PutItemInput = {
      TableName: this.userTableName!,
      // @ts-ignore
      Item: { username, userId, password: hashedPassword },
    };

    const user = await this.dynamoDBClient.put(params).promise();
    return { userId, username } as unknown as User;
  }
}
