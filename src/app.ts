import { ContractFunctions } from './functions/contract';
import { UserFunctions } from './functions/user';

import { AuthMiddleware } from './middlewares/auth';

const { create, jsonMiddleware, loggingMiddleware } = require('slspress');

const app = create();

app
  .on('createContract')
  .middleware(jsonMiddleware)
  .middleware(AuthMiddleware.jwtAuth)
  .middleware(loggingMiddleware)
  .post('/create-contract', ContractFunctions.createContract);

app
  .on('getContract')
  .middleware(jsonMiddleware)
  .middleware(AuthMiddleware.jwtAuth)
  .middleware(loggingMiddleware)
  .get('/get-contract', ContractFunctions.getContract);

app
  .on('getContractIDs')
  .middleware(jsonMiddleware)
  .middleware(AuthMiddleware.jwtAuth)
  .middleware(loggingMiddleware)
  .get('/get-contract-ids', ContractFunctions.getContractIds);

app
  .on('createUser')
  .middleware(jsonMiddleware)
  .middleware(loggingMiddleware)
  .post('/create-user', UserFunctions.createUser);

app
  .on('loginUser')
  .middleware(jsonMiddleware)
  .middleware(loggingMiddleware)
  .post('/login-user', UserFunctions.loginUser);

module.exports = app.export();
