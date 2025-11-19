import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { getBettingRecords } from '../../services/records.service';
import type { IBaseResponse } from '../../types/api';
import type {
  BettingRecord,
  PaginatedResponse,
  PaginationInfo,
} from '../../types/record';

export type BettingGameType = 'all' | 'casino' | 'slot' | 'sports';

// Helper function to get API parameters
const getApiParams = (
  days: number,
  gameType: BettingGameType = 'all',
  page: number = 1,
  pageSize: number = 10,
) => {
  const params: Record<string, string | number> = {
    days_ago: days,
    page,
    pagesize: pageSize,
  };

  // Add game type filter if not 'all'
  if (gameType !== 'all') {
    params.game_type = gameType;
  }

  return params;
};

// Hook for betting records with game type filtering
export const useBettingRecords = (
  days: number = 7,
  gameType: BettingGameType = 'all',
  page: number = 1,
  pageSize: number = 10,
) => {
  const queryClient = useQueryClient();

  const query = useQuery<IBaseResponse<PaginatedResponse<BettingRecord>>>({
    queryKey: ['betting-records', days, gameType, page, pageSize],
    queryFn: async () => {
      const params = getApiParams(days, gameType, page, pageSize);
      return getBettingRecords(params);
    },
  });

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ['betting-records'],
    });
  };

  const paginatedData = query.data?.data;
  const calculatedTotalPages = Math.ceil((paginatedData?.totalItems || 0) / pageSize);

  return {
    records: paginatedData?.data || [],
    pagination: {
      totalItems: paginatedData?.totalItems || 0,
      currentPage: paginatedData?.currentPage || 1,
      totalPage: paginatedData?.totalPage || calculatedTotalPages || 1,
      pageSize: paginatedData?.pageSize || pageSize,
      totalDeposit: (paginatedData as any)?.totalAmount || 0,
    } as PaginationInfo,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    error: query.error,
    refetch: query.refetch,
    invalidateQueries,
  };
};

// Hook for managing betting record state
export const useBettingRecordState = () => {
  const [activeTab, setActiveTab] = useState<BettingGameType>('all');
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
