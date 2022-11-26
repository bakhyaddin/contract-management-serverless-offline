import { sign, verify, VerifyErrors } from 'jsonwebtoken';
import { User } from '../database/entities/user';
import { BadTokenError, TokenExpiredError } from './ApiError';

export default class JWT {
  private static secretKey = process.env.SECRET_KEY!;

  public static async encode(payload: { username: string; userId: string }): Promise<string> {
    return Promise.resolve(
      sign(payload, this.secretKey, { expiresIn: '30m', issuer: 'contract-management' }),
    );
  }

  public static async validate(token: string): Promise<TDecodedToken> {
    return new Promise((res, rej) => {
      try {
        res(verify(token, this.secretKey) as TDecodedToken);
      } catch (err) {
        if (err && (err as VerifyErrors).name === 'TokenExpiredError') rej(new TokenExpiredError());
        rej(new BadTokenError());
      }
    });
  }

  public static async decode(token: string): Promise<TDecodedToken> {
    return new Promise((res, rej) => {
      try {
        res(verify(token, this.secretKey, { ignoreExpiration: true }) as TDecodedToken);
      } catch (err) {
        rej(new BadTokenError());
      }
    });
  }
}

export type TDecodedToken = {
  exp: number;
  iat: number;
  iss: string;
} & Omit<User, 'password'>;
