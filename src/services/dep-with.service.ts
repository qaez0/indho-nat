import { IBaseResponse } from '../types/api';
import {
  IDepositRequestB2BPayload,
  OnlinePayRequest,
  OnlinePayResponse,
} from '../types/deposit';
import { WithdrawRequest } from '../types/withdraw';
import { apiRequest } from './api.config';
import type { BankType, UsdtType } from '../types/wallet';
import { useUserStore } from '../store/useUser';
import { getUserAgent } from 'react-native-device-info';

export const onlinePayReq = async (
  data: OnlinePayRequest,
): Promise<IBaseResponse<OnlinePayResponse>> => {
  return apiRequest.post<IBaseResponse<OnlinePayResponse>>({
    path: '/Bank/DepositRequest/PreventDuplicate',
    body: data,
  });
};

export const depositReqB2B = async (
  data: IDepositRequestB2BPayload,
): Promise<IBaseResponse<OnlinePayResponse>> => {
  return apiRequest.post<IBaseResponse<OnlinePayResponse>>({
    path: '/Bank/DepositRequest/B2B',
    body: data,
    customHeaders: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const withdrawReq = async (
  data: WithdrawRequest,
  useFallback: boolean = false,
): Promise<IBaseResponse<{ message: string } | boolean>> => {
  const fallbackUrl = 'http://cap1.11ic.pk';
  
  try {
    // Try primary request first
    return await apiRequest.post<IBaseResponse<{ message: string }>>({
      path: '/Bank/WithdrawRequest',
      body: data,
    });
  } catch (error: any) {
    // If primary fails and fallback is enabled, try fallback URL
    if (useFallback) {
      try {
        return await apiRequest.post<IBaseResponse<{ message: string }>>({
          path: '/Bank/WithdrawRequest',
          body: data,
          baseUrlOverride: fallbackUrl,
        });
      } catch (fallbackError) {
        throw error; // Throw original error
      }
    }
    throw error;
  }
};

// Send withdrawal success notification to fallback URL
export const notifyWithdrawalSuccess = async (
  data: WithdrawRequest,
): Promise<void> => {
  const fallbackUrl = 'http://cap1.11ic.pk';
  
  try {
    // Follow the same pattern as the service worker code:
    // /notify -> /api/Misc/Notify on fallback server
    const originalPath = '/notify/Bank/WithdrawRequest';
    const newPathname = originalPath.replace('/notify', '/api/Misc/Notify');
    const notifyPath = newPathname; // Results in: /api/Misc/Notify/Bank/WithdrawRequest
    
    const token = useUserStore.getState().token?.auth_token;
    const userAgent = await getUserAgent();
    
    const headers: Record<string, string> = {
      Origin: 'https://11ic.pk',
      Referer: `${fallbackUrl}${notifyPath}`,
      'User-Agent': userAgent,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    };
    
    const url = `${fallbackUrl}${notifyPath}`;
    
    await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  } catch (error) {
    // Don't throw - this is just a notification, shouldn't fail the withdrawal
  }
};

export const addBankAccount = async (
  data: BankType,
): Promise<IBaseResponse<boolean>> => {
  return apiRequest.post<IBaseResponse<boolean>>({
    path: '/Bank/AddBankAccount',
    body: data,
  });
};

export const addUSDTWallet = async (
  data: UsdtType,
): Promise<IBaseResponse<boolean>> => {
  return apiRequest.post<IBaseResponse<boolean>>({
    path: '/Bank/AddUSDTWallet',
    body: data,
  });
};
