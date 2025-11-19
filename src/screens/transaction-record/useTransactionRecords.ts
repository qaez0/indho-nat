import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  getDepositRecords,
  getWithdrawalRecords,
  getBonusRecords,
  cancelDepositRequest,
} from '../../services/records.service';
import type { IBaseResponse } from '../../types/api';
import type {
  DepositRecord,
  WithdrawRecord,
  BonusRecord,
  PaginatedResponse,
  PaginationInfo,
  AnyTransactionRecord,
} from '../../types/record';

export type TransactionType = 'deposit' | 'withdrawal' | 'promo';

// Helper function to get API parameters
const getApiParams = (
  days: number,
  page: number = 1,
  pageSize: number = 10,
) => {
  return {
    days_ago: days,
    page,
    pagesize: pageSize,
  };
};

// Hook for deposit records
export const useDepositRecords = (
  days: number = 7,
  page: number = 1,
  pageSize: number = 10,
) => {
  const queryClient = useQueryClient();

  const query = useQuery<IBaseResponse<PaginatedResponse<DepositRecord>>>({
    queryKey: ['deposit-records', days, page, pageSize],
    queryFn: async () => {
      const params = getApiParams(days, page, pageSize);
      return getDepositRecords(params);
    },
  });

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ['deposit-records'],
    });
  };

  const paginatedData = query.data?.data;

  return {
    records: paginatedData?.data || [],
    pagination: {
      totalItems: paginatedData?.totalItems || 0,
      currentPage: paginatedData?.currentPage || 1,
      totalPage: paginatedData?.totalPage || 1,
      pageSize: paginatedData?.pageSize || 20,
      totalDeposit: paginatedData?.totalDeposit || 0,
    } as PaginationInfo,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    error: query.error,
    refetch: query.refetch,
    invalidateQueries,
  };
};

// Hook for withdrawal records
export const useWithdrawalRecords = (
  days: number = 7,
  page: number = 1,
  pageSize: number = 10,
) => {
  const queryClient = useQueryClient();

  const query = useQuery<IBaseResponse<PaginatedResponse<WithdrawRecord>>>({
    queryKey: ['withdrawal-records', days, page, pageSize],
    queryFn: async () => {
      const params = getApiParams(days, page, pageSize);
      return getWithdrawalRecords(params);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ['withdrawal-records'],
    });
  };

  const paginatedData = query.data?.data;

  return {
    records: paginatedData?.data || [],
    pagination: {
      totalItems: paginatedData?.totalItems || 0,
      currentPage: paginatedData?.currentPage || 1,
      totalPage: paginatedData?.totalPage || 1,
      pageSize: paginatedData?.pageSize || 20,
      totalDeposit: paginatedData?.totalDeposit || 0,
    } as PaginationInfo,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    error: query.error,
    refetch: query.refetch,
    invalidateQueries,
  };
};

// Hook for bonus records
export const useBonusRecords = (
  days: number = 7,
  page: number = 1,
  pageSize: number = 10,
) => {
  const queryClient = useQueryClient();

  const query = useQuery<IBaseResponse<PaginatedResponse<BonusRecord>>>({
    queryKey: ['bonus-records', days, page, pageSize],
    queryFn: async () => {
      const params = getApiParams(days, page, pageSize);
      return getBonusRecords(params);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ['bonus-records'],
    });
  };

  const paginatedData = query.data?.data;

  return {
    records: paginatedData?.data || [],
    pagination: {
      totalItems: paginatedData?.totalItems || 0,
      currentPage: paginatedData?.currentPage || 1,
      totalPage: paginatedData?.totalPage || 1,
      pageSize: paginatedData?.pageSize || 20,
      totalDeposit: paginatedData?.totalDeposit || 0,
    } as PaginationInfo,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    error: query.error,
    refetch: query.refetch,
    invalidateQueries,
  };
};

// Hook for canceling deposit requests
export const useCancelDepositRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderid,
      ...baseData
    }: { orderid: string } & Record<string, any>) => {
      return cancelDepositRequest({ orderid, ...baseData });
    },
    onSuccess: () => {
      // Invalidate and refetch deposit records
      queryClient.invalidateQueries({
        queryKey: ['deposit-records'],
      });
    },
    onError: error => {
      console.error('Failed to cancel deposit request:', error);
    },
  });
};

const fetchAllRecords = async (
  type: TransactionType,
  days: number,
): Promise<AnyTransactionRecord[]> => {
  let allRecords: AnyTransactionRecord[] = [];
  let currentPage = 1;
  let hasMore = true;
  const pageSize = 50; // Fetch larger chunks

  while (hasMore) {
    const params = {
      days_ago: days,
      page: currentPage,
      pagesize: pageSize,
    };

    let response;
    try {
      switch (type) {
        case 'deposit':
          response = await getDepositRecords(params);
          break;
        case 'withdrawal':
          response = await getWithdrawalRecords(params);
          break;
        case 'promo':
          response = await getBonusRecords(params);
          break;
        default:
          hasMore = false;
          break;
      }

      if (!response) {
        hasMore = false;
        continue;
      }

      const paginatedData = response.data;
      if (paginatedData && Array.isArray(paginatedData.data)) {
        allRecords = [...allRecords, ...paginatedData.data];
        if (
          paginatedData.currentPage &&
          paginatedData.totalPage &&
          paginatedData.currentPage >= paginatedData.totalPage
        ) {
          hasMore = false;
        } else {
          currentPage++;
        }
      } else {
        hasMore = false;
      }
    } catch (error) {
      console.error(`Error fetching all records for ${type}:`, error);
      hasMore = false;
    }
  }

  return allRecords;
};

export const useAllTransactionRecords = (
  type: TransactionType,
  days: number,
) => {
  return useQuery<AnyTransactionRecord[], Error>({
    queryKey: [`all-${type}-records`, days],
    queryFn: () => fetchAllRecords(type, days),
    enabled: !!type,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for managing transaction record state
export const useTransactionRecordState = () => {
  const [activeTab, setActiveTab] = useState<TransactionType>('deposit');
  const [selectedDays, setSelectedDays] = useState<number>(7);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = (totalPages: number) => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    activeTab,
    setActiveTab,
    selectedDays,
    setSelectedDays,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    expandedItems,
    toggleExpanded,
    goToPage,
    goToNextPage,
    goToPrevPage,
    resetPagination,
  };
};
