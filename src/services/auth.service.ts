import { MICROSERVICE_URL } from '@env';
import type { IBaseBody, IBaseResponse } from '../types/api';
import type {
  IAppsFlyerPayload,
  IForgotEmail,
  IForgotSms,
  ILoginResponse,
  IRegisterPlayer,
  IResetPasswordEmail,
  IResetPasswordSms,
  ISsoLoginPayload,
  ITelegramLoginPayload,
} from '../types/auth';
import { IDevice } from '../types/device';
import type { IAdjustId, IIsRegistered, IPlayerDetails } from '../types/player';
import { apiRequest } from './api.config';

export const loginPlayer = async (
  data: {
    password: string;
    player_id?: string;
    phone?: string;
  } & IDevice,
  type: 'username' | 'phone',
  adjustid?: string | null,
) => {
  const endpoint = type === 'username' ? '/Login' : '/Login/PhoneLogin';
  return apiRequest.post<IBaseResponse<string> & ILoginResponse>({
    path: endpoint,
    body: data,
    customHeaders: adjustid
      ? {
          adjustid: adjustid,
        }
      : undefined,
  });
};

export const forgotSmsRequest = async (data: IForgotSms) => {
  return apiRequest.post<
    IBaseResponse<{ message: string; timer?: number; guid?: string }>
  >({
    path: '/Player/SMSRecoveryRequest',
    body: data,
  });
};
export const forgotEmailRequest = async (data: IForgotEmail) => {
  return apiRequest.post<IBaseResponse<{ message: string }>>({
    path: '/Player/ForgotPasswordRequest',
    body: data,
  });
};

export const resetPasswordSms = async (data: IResetPasswordSms & IBaseBody) => {
  return apiRequest.post<IBaseResponse<{ message: string }>>({
    path: '/Player/SMSRecoveryReset',
    body: data,
  });
};

export const resetPasswordEmail = async (
  data: IResetPasswordEmail & IBaseBody,
) => {
  return apiRequest.post<IBaseResponse<{ message: string }>>({
    path: '/Player/ForgotPasswordReset',
    body: data,
  });
};

export const registerPlayer = async (
  data: IRegisterPlayer & IDevice,
  adjustid: string | null,
) => {
  return apiRequest.post<IBaseResponse<IPlayerDetails>>({
    path: '/Player/Register/PhoneOnly',
    body: data,
    customHeaders: adjustid
      ? {
          adjustid: adjustid,
        }
      : undefined,
  });
};

export const isPlayerRegistered = async (data: IAdjustId) => {
  return apiRequest.post<IBaseResponse<IIsRegistered>>({
    path: '/Player/Adjust/IsRegistered',
    body: data,
  });
};

//TODO-BE: This api only accepts player_id. What about phone number?
export const appsFlyer = async (data: IAppsFlyerPayload) => {
  return apiRequest.post<IBaseResponse<string>>({
    path: '/Player/AppsflyerPushEvents',
    body: data,
  });
};

export const ssoLogin = async (
  data: ISsoLoginPayload,
  adjustid?: string | null,
) => {
  return apiRequest.post<IBaseResponse<string> & ILoginResponse>({
    path: '/Login/SSO',
    body: data,
    customHeaders: adjustid
      ? {
          adjustid: adjustid,
        }
      : undefined,
  });
};

export const telegramLogin = async (
  data: ITelegramLoginPayload,
  adjustid?: string | null,
) => {
  console.log('--- Calling Telegram Login API ---');
  console.log('Endpoint:', `${MICROSERVICE_URL}/telegram/auth/login`);
  console.log('Payload:', JSON.stringify(data, null, 2));
  return apiRequest.post<IBaseResponse<string> & ILoginResponse>({
    baseUrlOverride: MICROSERVICE_URL,
    path: '/telegram/auth/login',
    body: data,
    customHeaders: adjustid
      ? {
          adjustid: adjustid,
        }
      : undefined,
  });
};
