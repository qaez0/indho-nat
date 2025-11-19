import { useReducer, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSlots, type SlotQueryParams, type ISlotListResponse } from '../services/slots.service';
import type { IBaseResponse } from '../types/api';

export type SlotFilterState = {
  name: string;
  category: string;
  game_id: string;
  page: number;
  pagesize: number;
};

export type SlotFilterAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_GAME_ID'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number }
  | { type: 'RESET_FILTER'; payload: SlotFilterState };

function reducer(state: SlotFilterState, action: SlotFilterAction): SlotFilterState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'SET_GAME_ID':
      return { ...state, game_id: action.payload, page: 1, name: '' };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_PAGE_SIZE':
      return { ...state, pagesize: action.payload };
    case 'RESET_FILTER':
      return action.payload;
    default:
      return state;
  }
}

export const useSlots = (initial: SlotFilterState) => {
  const [state, dispatch] = useReducer(reducer, initial);

  const query = useQuery<IBaseResponse<ISlotListResponse>>({
    queryKey: ['slot-list', state],
    queryFn: async () => {
      const params: SlotQueryParams = {};
      Object.entries(state).forEach(([k, v]) => {
        if (typeof v === 'string') {
          if (v.trim() !== '') (params as any)[k] = v;
        } else if (typeof v === 'number') {
          (params as any)[k] = v;
        }
      });
      return fetchSlots(params);
    },
  });

  return { ...query, state, dispatch };
};
