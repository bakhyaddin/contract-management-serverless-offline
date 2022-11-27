import { CreatedResponse, SuccessResponse } from '../core/ApiResponse';
import { NoDataError, BadRequestError, ForbiddenError } from '../core/ApiError';

import { ContractService } from '../services/contract';
import { Contract } from '../database/entities/contract';

import asyncHandler from '../utils/asyncHandler';

export class ContractFunctions {
  public static createContract = asyncHandler(
    async (req: RequestSlsPress, res: ResponseSlsPress): Promise<ResponseBody<Contract>> => {
      const { contractName, templateId } = req.event.body!;
      const { userId } = req.event.user!;

      const contract = await ContractService.create(userId, contractName, templateId);
      return new CreatedResponse<Contract>('Contract created successfully', contract).send(res);
    },
  );

  public static getContract = asyncHandler(
    async (req: RequestSlsPress, res: ResponseSlsPress): Promise<ResponseBody<Contract>> => {
      const id = req.event.queryStringParameters?.id;
      const { userId } = req.event.user!;

      if (!id) {
        throw new BadRequestError('Please provide an id');
      }

      const contract = await ContractService.getContract(id);
      if (!contract) {
        throw new NoDataError(`No contract found: ${id}`);
      }

      if (userId !== contract.userId) {
        throw new ForbiddenError(`Not permitted to access contract: ${id}`);
      }

      return new SuccessResponse<Contract>('Contract fetched successfully', contract).send(res);
    },
  );

  public static getContractIds = asyncHandler(
    async (
      req: RequestSlsPress,
      res: ResponseSlsPress,
    ): Promise<ResponseBody<Array<{ contractId: string }>>> => {
      const { userId } = req.event.user!;
      const contractIds = await ContractService.getContractIds(userId);

      if (contractIds.length === 0) {
        throw new NoDataError('No contracts found');
      }

      return new SuccessResponse<Array<{ contractId: string }>>(
        'Contract IDs fetched successfully',
        contractIds,
      ).send(res);
    },
  );
}
