import type { IBaseResponse, IPanelInfoResponse } from '../types/api';
import type {
  ChangePasswordType,
  CreateWithdrawalPasswordType,
  IBalanceResponse,
  VerifyEmailType,
  RequestOtp,
  SetWalletPasswordType,
  UpdateProfileType,
  UpdateRealNameType,
  VerfiyPhoneNumber,
} from '../types/player';
import { IWebInfoData } from '../types/ui';
import { apiRequest } from './api.config';

export const getPanelInfo = async (): Promise<
  IBaseResponse<IPanelInfoResponse>
> => {
  return apiRequest.get<IBaseResponse<IPanelInfoResponse>>({
    path: '/Player/PanelInfo',
  });
};

export const getBalance = async (): Promise<
  IBaseResponse<IBalanceResponse>
> => {
  return apiRequest.get<IBaseResponse<IBalanceResponse>>({
    path: '/Player/Balance',
  });
};

export const updatePassword = async (
  data: ChangePasswordType,
): Promise<IBaseResponse<boolean>> => {
  return apiRequest.post<IBaseResponse<any>>({
    path: '/Player/InfoUpdate/LoginPassword',
    body: data,
  });
};

export const updateWalletPassOrRealName = async (
  data: SetWalletPasswordType | UpdateRealNameType | UpdateProfileType,
): Promise<IBaseResponse<{ message: string }>> => {
  return apiRequest.post<IBaseResponse<{ message: string }>>({
    path: '/Player/InfoUpdate',
    body: data,
  });
};

export const requestOtpPhoneVerification = async (
  data: RequestOtp,
): Promise<IBaseResponse<{ message: string }>> => {
  return apiRequest.post<IBaseResponse<{ message: string }>>({
    path: '/Player/PhoneVerifyRequestPrefilledNumber',
    body: data,
  });
};

export const verifyPhoneNumber = async (
  data: VerfiyPhoneNumber,
): Promise<IBaseResponse<{ message: string }>> => {
  return apiRequest.post<IBaseResponse<{ message: string }>>({
    path: '/Player/PhoneVerifyValidate',
    body: data,
  });
};

export const createWithdrawalPassword = async (
  data: CreateWithdrawalPasswordType,
): Promise<IBaseResponse<{ message: string }>> => {
  return apiRequest.post<IBaseResponse<{ message: string }>>({
    path: '/Player/InfoUpdate/WithdrawPassword',
    body: data,
  });
};

export const requestOtpEmailVerification = async (
  data: VerifyEmailType,
): Promise<IBaseResponse<{ message: string }>> => {
  return apiRequest.post<IBaseResponse<{ message: string }>>({
    path: '/Player/EmailVerifyRequest',
    body: data,
  });
};

export const verifyEmail = async (
  data: VerfiyPhoneNumber,
): Promise<IBaseResponse<{ message: string }>> => {
  return apiRequest.post<IBaseResponse<{ message: string }>>({
    path: '/Player/EmailVerifyValidate',
    body: data,
  });
};

export const uploadKycImage = async (
  formData: FormData,
): Promise<IBaseResponse<{ message: string }>> => {
  return apiRequest.post<IBaseResponse<{ message: string }>>({
    path: '/Player/UploadImageKYC',
    body: formData,
    // Note: Content-Type header is automatically set by fetch for FormData
  });
};

export const getMenuLists = async (): Promise<IBaseResponse<IWebInfoData>> => {
  return apiRequest.get<IBaseResponse<IWebInfoData>>({
    path: '/Web/WebInfo',
  });
};
