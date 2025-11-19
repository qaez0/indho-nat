import type { IBaseBody, IBaseResponse } from '../types/api';
import type {
  DepositRecord,
  WithdrawRecord,
  BonusRecord,
  BettingRecord,
  LockRecord,
  PaginatedResponse,
} from '../types/record';
import { apiRequest } from './api.config';

export const getDepositRecords = async (
  params?: Record<string, string | number>,
) => {
  return apiRequest.get<IBaseResponse<PaginatedResponse<DepositRecord>>>({
    path: '/Player/DepositRecord',
    params,
  });
};

export const getWithdrawalRecords = async (
  params?: Record<string, string | number>,
) => {
  return apiRequest.get<IBaseResponse<PaginatedResponse<WithdrawRecord>>>({
    path: '/Player/WithdrawRecord',
    params,
  });
};

export const getBonusRecords = async (
  params?: Record<string, string | number>,
) => {
  return apiRequest.get<IBaseResponse<PaginatedResponse<BonusRecord>>>({
    path: '/Player/BonusRecord',
    params,
  });
};

export const getBettingRecords = async (
  params?: Record<string, string | number>,
) => {
  return apiRequest.get<IBaseResponse<PaginatedResponse<BettingRecord>>>({
    path: '/Bet/BetRecord',
    params,
  });
};

export const getLockRecords = async (
  params?: Record<string, string | number>,
) => {
  return apiRequest.get<IBaseResponse<PaginatedResponse<LockRecord>>>({
    path: '/Player/LockAmountRecord',
    params,
  });
};

export const cancelDepositRequest = async (
  data: { orderid: string } & IBaseBody,
) => {
  return apiRequest.post<IBaseResponse<string>>({
    path: '/Bank/DepositRequest/Cancel',
    body: data,
  });
};
