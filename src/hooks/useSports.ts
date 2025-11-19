import { useReducer } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSlots } from '../services/slots.service';
import type { IBaseResponse } from '../types/api';
import { ISlot } from '../types/slot';

export type SportsFilterState = {
  name: string;
  game_id: string; // provider filter
  page: number;
  pagesize: number;
};

export type SportsFilterAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_GAME_ID'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number };

function reducer(
  state: SportsFilterState,
  action: SportsFilterAction,
): SportsFilterState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_GAME_ID':
      return { ...state, game_id: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_PAGE_SIZE':
      return { ...state, pagesize: action.payload };
    default:
      return state;
  }
}

export const useSports = (initial: SportsFilterState) => {
  const [state, dispatch] = useReducer(reducer, initial);

  const query = useQuery<
    IBaseResponse<{
      data: ISlot[];
      totalPage: number;
      currentPage: number;
      pageSize: number;
    }>
  >({
    queryKey: ['sports-list', state],
    queryFn: async () => {
      return fetchSlots({
        name: state.name,
        category: 'SPORTS',
        game_id: state.game_id,
        page: state.page,
        pagesize: state.pagesize,
      });
    },
  });

  return { ...query, state, dispatch };
};
