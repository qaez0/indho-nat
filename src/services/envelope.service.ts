import { apiRequest } from './api.config';
import type {
  IEnvelopeSettingResponse,
  IInviteLinkResponse,
  IPickEnvelopeResponse,
  IPickSpinResponse,
  IWithdrawRewardResponse,
  ILuckyEnvelopeEventInfoResponse,
} from '../types/envelope';

export const getEnvelopeSetting = async (): Promise<IEnvelopeSettingResponse> => {
  const response = await apiRequest.get<IEnvelopeSettingResponse>({
    path: '/Bonus/LuckyEnvelopeEventSetting',
  });
  return response;
};

export const getInviteLink = async (): Promise<IInviteLinkResponse> => {
  const response = await apiRequest.get<IInviteLinkResponse>({
    path: '/Invite/InviteCashBackDetails',
  });
  return response;
};

export const pickEnvelope = async (
  envelopeNumber: number,
): Promise<IPickEnvelopeResponse> => {
  const response = await apiRequest.post<IPickEnvelopeResponse>({
    path: '/Bonus/SelectLuckyEnvelope',
    body: { envelope_number: envelopeNumber },
  });
  return response;
};

export const pickSpin = async (): Promise<IPickSpinResponse> => {
  const response = await apiRequest.post<IPickSpinResponse>({
    path: '/Bonus/PlayLuckySpinEnvelope',
  });
  return response;
};

export const withdrawReward = async (
  _reward: number,
): Promise<IWithdrawRewardResponse> => {
  const response = await apiRequest.post<IWithdrawRewardResponse>({
    path: '/Bonus/ClaimLuckyEnvelopeReward',
  });
  return response;
};

export const fetchEventDetails = async (): Promise<ILuckyEnvelopeEventInfoResponse> => {
  const response = await apiRequest.get<ILuckyEnvelopeEventInfoResponse>({
    path: '/Bonus/LuckyEnvelopeEventInfo',
  });
  return response;
};

