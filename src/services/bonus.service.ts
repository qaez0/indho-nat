import { IBaseResponse } from '../types/api';
import { BonusTask } from '../types/bonus';
import { apiRequest } from './api.config';

export const BonusTaskList = async () => {
  return apiRequest.get<
    IBaseResponse<{
      Data: BonusTask[];
    }>
  >({
    path: '/Bonus/BonusTaskList',
  });
};

export const BonusTaskListNoAuth = async () => {
  return apiRequest.get<
    IBaseResponse<{
      Data: BonusTask[];
    }>
  >({
    path: '/Bonus/BonusTaskListNoAuth',
  });
};

export const BonusTaskClaim = async (id: number) => {
  return apiRequest.post<
    IBaseResponse<{
      Data: BonusTask;
    }>
  >({
    path: `/Bonus/BonusTaskClaim`,
    body: {
      id,
    },
  });
};
