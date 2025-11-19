import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { IBaseResponse, IPanelInfoResponse } from '../types/api';
import type { IBalanceResponse } from '../types/player';
import { useUserStore } from '../store/useUser';
import { getPanelInfo, getBalance } from '../services/user.service';

export const useUser = () => {
  const setUser = useUserStore(s => s.setUser);
  const user = useUserStore(s => s.user);
  const balance = useUserStore(s => s.balance);
  const setBalance = useUserStore(s => s.setBalance);
  const token = useUserStore(s => s.token);
  const isAuthenticated = !!token?.auth_token;
  const queryClient = useQueryClient();

  const panelInfo = useQuery<IBaseResponse<IPanelInfoResponse>>({
    queryKey: ['panel-info', isAuthenticated],
    queryFn: async () => {
      const response = await getPanelInfo();
      setUser(response.data);
      return response;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const balanceInfo = useQuery<IBaseResponse<IBalanceResponse>>({
    queryKey: ['balance', isAuthenticated],
    queryFn: async () => {
      const response = await getBalance();
      setBalance(response.data);
      return response;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const invalidate = (which: 'panel-info' | 'balance') => {
    queryClient.invalidateQueries({ queryKey: [which] });
  };

  return {
    user: panelInfo.data?.data ?? user,
    balance: balanceInfo.data?.data ?? balance,
    isLoading: {
      balance: balanceInfo.isPending || balanceInfo.isFetching,
      panelInfo: panelInfo.isPending || panelInfo.isFetching,
    },
    isRefetching: {
      balance: balanceInfo.isRefetching,
      panelInfo: panelInfo.isRefetching,
    },
    invalidate,
    isAuthenticated,
  };
};
