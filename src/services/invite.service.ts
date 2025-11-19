import { apiRequest } from './api.config';
import type { IBaseResponse } from '../types/api';
import type {
  IInviteLinkResponse,
  IRebateReport,
  IEarningHistoryResponse,
  IRebateSettingResponse,
  InviteBonusResponse,
  IQueryParams,
} from '../types/invite';

export const getInviteLink = async () => {
  return apiRequest.get<IInviteLinkResponse>({
    path: '/Invite/InviteCashBackDetails',
  });
};

export const getRebateReportTotal = async () => {
  return apiRequest.get<IBaseResponse<{ total_reward_amount: number }>>({
    path: '/Bonus/RebateReport',
    params: {
      total_rewards_only: 'true',
    },
  });
};

export const getEarningHistory = async (params: IQueryParams) => {
  return apiRequest.get<IEarningHistoryResponse>({
    path: '/Bonus/RebateEarningHistory',
    params: params as unknown as Record<string, string | number>,
  });
};

export const getRebateSetting = async () => {
  return apiRequest.get<IRebateSettingResponse>({
    path: '/Bonus/RebateSetting',
    baseUrlOverride: 'https://11ic.fun/capi',
  });
};

export const getRebateReport = async (params: IQueryParams) => {
  return apiRequest.get<IBaseResponse<IRebateReport>>({
    path: '/Bonus/RebateReport',
    params: params as unknown as Record<string, string | number>,
  });
};

export const getInviteBonus = async (period?: string) => {
  return apiRequest.get<InviteBonusResponse>({
    path: '/Player/InviteBonus',
    params: period ? { period } : undefined,
  });
};
