import { ContractFunctions } from './src/functions/contract';
import { UserFunctions } from './src/functions/user';

import { AuthMiddleware } from './src/middlewares/auth';

const { create, jsonMiddleware, loggingMiddleware } = require('slspress');

const handler = create();

handler
  .on('createContract')
  .middleware(jsonMiddleware)
  .middleware(AuthMiddleware.jwtAuth)
  .middleware(loggingMiddleware)
  .post('/create-contract', ContractFunctions.createContract);

handler
  .on('getContract')
  .middleware(jsonMiddleware)
  .middleware(AuthMiddleware.jwtAuth)
  .middleware(loggingMiddleware)
  .get('/get-contract', ContractFunctions.getContract);

handler
  .on('getContractIDs')
  .middleware(jsonMiddleware)
  .middleware(AuthMiddleware.jwtAuth)
  .middleware(loggingMiddleware)
  .get('/get-contract-ids', ContractFunctions.getContractIds);

handler
  .on('createUser')
  .middleware(jsonMiddleware)
  .middleware(loggingMiddleware)
  .post('/create-user', UserFunctions.createUser);

handler
  .on('loginUser')
  .middleware(jsonMiddleware)
  .middleware(loggingMiddleware)
  .post('/login-user', UserFunctions.loginUser);

module.exports = handler.export();
