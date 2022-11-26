import { ContractFunctions } from './src/functions/contract';
import { UserFunctions } from './src/functions/user';

import { AuthMiddleware } from './src/middlewares/auth';

const { create, jsonMiddleware } = require('slspress');

const handler = create();

handler
  .on('createContract')
  .middleware(jsonMiddleware)
  .middleware(AuthMiddleware.jwtAuth)
  .post('/create-contract', ContractFunctions.createContract);

handler
  .on('getContract')
  .middleware(jsonMiddleware)
  .middleware(AuthMiddleware.jwtAuth)
  .get('/get-contract', ContractFunctions.getContract);

handler
  .on('getContractIDs')
  .middleware(jsonMiddleware)
  .middleware(AuthMiddleware.jwtAuth)
  .get('/get-contract-ids', ContractFunctions.getContractIDs);

handler.on('createUser').middleware(jsonMiddleware).post('/create-user', UserFunctions.createUser);

handler.on('loginUser').middleware(jsonMiddleware).post('/login-user', UserFunctions.loginUser);

module.exports = handler.export();
