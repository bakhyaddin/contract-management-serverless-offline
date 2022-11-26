import { SuccessResponse } from '../core/ApiResponse';
import { NoDataError, BadRequestError, ForbiddenError } from '../core/ApiError';

import { ContractService } from '../services/contract';

import errorHandler from '../utils/errorHandler';

export class ContractFunctions {
  public static createContract = errorHandler(async (req, res) => {
    const body = req.event.body;
    const { userId } = req.event.user;

    const { contractName, templateId } = body;

    const data = await ContractService.create(userId, contractName, templateId);
    return new SuccessResponse('Contract created successfully', data).send(res);
  });

  public static getContract = errorHandler(async (req, res) => {
    const id = req.event.queryStringParameters?.id;
    const { userId } = req.event.user;

    if (!id) {
      throw new BadRequestError('Please provide an id');
    }

    const constract = await ContractService.getContract(id);
    if (!constract) {
      throw new NoDataError(`No contract found: ${id}`);
    }

    if (userId !== constract.userId) {
      throw new ForbiddenError(`Not permitted to access contract: ${id}`);
    }

    return new SuccessResponse('Contract fetched successfully', constract).send(res);
  });

  public static getContractIDs = errorHandler(async (req, res) => {
    const { userId } = req.event.user;
    const data = await ContractService.getContractIds(userId);

    if (!data || data.length === 0) {
      throw new NoDataError('No contracts found');
    }

    return new SuccessResponse('Contract IDs fetched successfully', data).send(res);
  });
}
