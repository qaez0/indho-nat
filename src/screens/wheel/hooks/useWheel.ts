import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import type { IBaseResponse } from '../../../types/api';
import {
  fetchWheelPrizes,
  playWheel,
  fetchSpinCount,
  fetchCheckInDates,
  fetchUserRewards,
  claimFreeSpin,
} from '../../../services/wheel.service';
import { useUser } from '../../../hooks/useUser';
import { RouletteData } from '../../../types/wheel';

export const useWheel = (enableQueries: boolean = true) => {
  const { isAuthenticated } = useUser();

  const getPrices = async () => fetchWheelPrizes();
  const getSpinResult = async (payload: { player_id: string }) =>
    playWheel(payload);
  const getSpinCount = async () => fetchSpinCount();
  const getCheckInDates = async () => fetchCheckInDates('2024-12-31');
  const getUserRewards = async () => fetchUserRewards('2024-12-31');

  const queryPrizes = useQuery({
    queryKey: ['prizes-spin-wheel'],
    queryFn: getPrices,
    retry: false,
    enabled: enableQueries,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const querySpinCount = useQuery({
    queryKey: ['reward-count-spin-wheel'],
    queryFn: getSpinCount,
    retry: false,
    enabled: !!isAuthenticated && enableQueries,
    staleTime: 0,
    refetchOnMount: true,
  });

  const queryCheckInAndRewards = useQueries({
    queries: [
      {
        queryKey: ['check-in-dates-spin-wheel'],
        queryFn: getCheckInDates,
        retry: false,
        enabled: !!isAuthenticated && enableQueries,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
      },
      {
        queryKey: ['user-rewards-spin-wheel'],
        queryFn: getUserRewards,
        retry: false,
        enabled: !!isAuthenticated && enableQueries,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
      },
    ],
  });

  const querySpinResult = useMutation<
    IBaseResponse<RouletteData>,
    Error,
    { player_id: string }
  >({
    mutationFn: getSpinResult,
    mutationKey: ['spin-result-spin-wheel'],
  });

  const claimFreeSpinMutation = useMutation({
    mutationFn: claimFreeSpin,
    onSuccess: () => {
      querySpinCount.refetch();
    },
  });

  return {
    queryPrizes,
    querySpinCount,
    querySpinResult,
    queryCheckInAndRewards,
    claimFreeSpinMutation,
  };
};
