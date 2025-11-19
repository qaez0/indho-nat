import type { IBaseResponse } from './api';

export interface IInviteRecord {
  invite_date: string;
  invitee: string;
}

export interface ISpinRecord {
  spin_date: string;
  reward: number;
}

export interface IEventInfo {
  id: number;
  player_id: string;
  event_start_time: string;
  event_end_time: string;
  recent_reward: number;
  total_received_reward: number;
  total_remaining_reward: number;
  total_spin_left: number;
  total_invites: number;
  status: string;
}

export interface IEventDetails {
  eventInfo: IEventInfo;
  invitationRecord: IInviteRecord[];
  spinRecord: ISpinRecord[];
}

export type ILuckyEnvelopeEventInfoResponse = IBaseResponse<IEventDetails>;

export interface IEnvelopeSettingItem {
  max_envelope_count: number;
  // other fields may exist, add as needed
}
export type IEnvelopeSettingResponse = IBaseResponse<IEnvelopeSettingItem[]>;

export interface IEnvelopeReward {
  envelope_number: number;
  reward_amount: number;
  selected: boolean;
}
export type IPickEnvelopeResponse = IBaseResponse<IEnvelopeReward[]>;

export interface ISpinResultReward {
  id: number;
  envelope_event_id: number;
  player_id: string;
  reward_type: string;
  reward: number;
  total_received_reward: number;
  create_time: string;
}
export type IPickSpinResponse = IBaseResponse<ISpinResultReward[] | null>;

export type IWithdrawRewardResponse = IBaseResponse<unknown>;

export type IInviteLinkResponse = IBaseResponse<{
  invite_code: string;
  invite_link: string;
}>;
