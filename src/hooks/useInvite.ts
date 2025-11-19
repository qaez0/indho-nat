import { useQueries } from '@tanstack/react-query';
import { useUser } from './useUser';
import {
  getInviteLink,
  getRebateReportTotal,
  getEarningHistory,
  getRebateSetting,
  getRebateReport,
  getInviteBonus,
} from '../services/invite.service';
import type { IQueryParams } from '../types/invite';

export const useInvite = (
  activeTimeFilter?: string,
  rebateReportParams?: IQueryParams,
  earningHistoryParams?: IQueryParams,
) => {
  const { isAuthenticated } = useUser();

  const results = useQueries({
    queries: [
      {
        queryKey: ['invite-link'],
        queryFn: getInviteLink,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 5,
      },
      {
        queryKey: ['rebateReportTotal'],
        queryFn: getRebateReportTotal,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 5,
      },
      {
        queryKey: ['earningHistory', earningHistoryParams],
        queryFn: () => getEarningHistory(earningHistoryParams!),
        enabled: isAuthenticated && !!earningHistoryParams,
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 5,
      },
      {
        queryKey: ['rebateSetting'],
        queryFn: getRebateSetting,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 5,
      },
      {
        queryKey: ['rebateReport', rebateReportParams],
        queryFn: () => getRebateReport(rebateReportParams!),
        enabled: isAuthenticated && !!rebateReportParams,
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 5,
      },
      {
        queryKey: ['inviteBonus', activeTimeFilter],
        queryFn: () => getInviteBonus(activeTimeFilter),
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 5,
      },
    ],
  });

  return {
    results,
    isLoading: results.some(result => result.isLoading),
    error: results.find(result => result.error)?.error,
  };
};
