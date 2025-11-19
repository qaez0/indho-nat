import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { getLockRecords } from '../../services/records.service';
import type { IBaseResponse } from '../../types/api';
import type {
  LockRecord,
  PaginatedResponse,
  PaginationInfo,
} from '../../types/record';

export type LockType = 'deposit' | 'promo';
export type StatusFilter = 'all' | 'incomplete' | 'completed';

// Helper function to get API parameters
const getApiParams = (
  days: number,
  page: number = 1,
  pageSize: number = 10,
) => {
  const params: Record<string, string | number> = {
    days_ago: days,
    page,
    pagesize: pageSize,
    device: 1, // Default device parameter
  };

  return params;
};

// Hook for lock records
export const useLockRecords = (
  days: number = 30,
  page: number = 1,
  pageSize: number = 10,
) => {
  const queryClient = useQueryClient();

  const query = useQuery<IBaseResponse<PaginatedResponse<LockRecord>>>({
    queryKey: ['lock-records', days, page, pageSize],
    queryFn: async () => {
      const params = getApiParams(days, page, pageSize);
      return getLockRecords(params);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ['lock-records'],
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

// Helper function to filter records by type and status
export const filterLockRecords = (
  records: LockRecord[],
  lockType: LockType,
  statusFilter: StatusFilter,
): LockRecord[] => {
  return records.filter(record => {
    // Filter by lock type
    const matchesType = lockType === 'deposit' 
      ? (record.lock_type === 'DEPOSIT' || record.lock_type === 'RESIZE')
      : record.lock_type === 'PROMO';
    
    if (!matchesType) return false;

    // Filter by status
    if (statusFilter === 'all') return true;
    
    const recordStatus = record.status?.toUpperCase();
    if (statusFilter === 'incomplete') return recordStatus === 'LOCKED';
    if (statusFilter === 'completed') return recordStatus === 'UNLOCK';
    
    return false;
  });
};

// Hook for managing lock record state
export const useLockRecordState = () => {
  const [activeTab, setActiveTab] = useState<LockType>('deposit');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [selectedDays, setSelectedDays] = useState<number>(30);
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

  const resetFilters = () => {
    setActiveTab('deposit');
    setSelectedStatus('all');
    setCurrentPage(1);
    setExpandedItems(new Set());
  };

  return {
    activeTab,
    setActiveTab,
    selectedStatus,
    setSelectedStatus,
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
    resetFilters,
  };
};