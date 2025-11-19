import { apiRequest } from './api.config';
import type { IBaseResponse } from '../types/api';
import { ISlot } from '../types/slot';

export interface ISlotListResponse {
  data: ISlot[];
  totalItems: number;
  currentPage: number;
  totalPage: number;
  pageSize: number;
}

export interface SlotQueryParams {
  name?: string;
  category?: string;
  game_id?: string;
  page?: number;
  pagesize?: number;
}

export const fetchSlots = async (params: SlotQueryParams) => {
  const query: Record<string, string | number> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'string') {
      if (value.trim() !== '') query[key] = value;
    } else if (typeof value === 'number') {
      query[key] = value;
    }
  });

  return apiRequest.get<IBaseResponse<ISlotListResponse>>({
    path: '/Web/Games',
    params: query,
  });
};
