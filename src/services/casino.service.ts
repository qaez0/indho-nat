import type { IBaseResponse } from '../types/api';
import type { ICasinoResponse, LiveCasino } from '../types/casino';
import { apiRequest } from './api.config';

export const getCasinoGames = async (
  selectedProvider: LiveCasino = 'all',
): Promise<IBaseResponse<ICasinoResponse>> => {
  const params: Record<string, string | number> = {
    pagesize: 500,
    page: 1,
  };

  if (selectedProvider !== 'all') {
    params.game_id = selectedProvider;
    params.category = 'BACCARAT,BLACKJACK,ROULETTE,TEENPATTI,DICE,POKER,OTHERS';
  } else {
    params.category = 'CASINO';
  }

  try {
    const response = await apiRequest.get<IBaseResponse<ICasinoResponse>>({
      path: '/Web/Games',
      params,
    });

    return response;
  } catch (error) {
    console.error('Casino API Error:', error);
    throw error;
  }
};
