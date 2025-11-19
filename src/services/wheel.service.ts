import { apiRequest } from './api.config';
import { PUBLIC_CLIENT_KEY, MICROSERVICE_URL } from '@env';

export const fetchWheelPrizes = async () => {
  return apiRequest.get<any>({
    path: '/spin-wheel/prizes',
    customHeaders: { 'X-Client-Key': PUBLIC_CLIENT_KEY },
    baseUrlOverride: MICROSERVICE_URL,
  });
};

export const playWheel = async (payload: { player_id: string }) => {
  return apiRequest.post<any>({
    path: '/spin-wheel/play',
    body: payload,
    customHeaders: { 'X-Client-Key': PUBLIC_CLIENT_KEY },
    baseUrlOverride: MICROSERVICE_URL,
  });
};

export const fetchSpinCount = async () => {
  return apiRequest.get<any>({
    path: '/spin-wheel/reward-count',
    customHeaders: { 'X-Client-Key': PUBLIC_CLIENT_KEY },
    baseUrlOverride: MICROSERVICE_URL,
  });
};

export const fetchCheckInDates = async (startDate: string) => {
  return apiRequest.get<any>({
    path: '/Bonus/Spin/CheckDates/CheckIn',
    params: { start_date: startDate },
    customHeaders: { 'X-Client-Key': PUBLIC_CLIENT_KEY },
  });
};

export const fetchUserRewards = async (startDate: string) => {
  return apiRequest.get<any>({
    path: '/Bonus/Spin/CheckDates/Rewards',
    params: { start_date: startDate },
    customHeaders: { 'X-Client-Key': PUBLIC_CLIENT_KEY },
  });
};

export const claimFreeSpin = async () => {
  return apiRequest.post<any>({
    path: '/spin-wheel/claim-free-spin',
    customHeaders: { 'X-Client-Key': PUBLIC_CLIENT_KEY },
    baseUrlOverride: MICROSERVICE_URL,
  });
};