require('dotenv').config();
export const jwtSecretKey = process.env.SECRET_KEY!;

export const region = process.env.AWS_REGION;
export const endpoint = process.env.AWS_ENDPOINT;

export const usersTableName = process.env.USERS_TABLE_NAME!;
export const contractsTableName = process.env.CONTRACTS_TABLE_NAME!;
