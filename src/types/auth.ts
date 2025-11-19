import { IDevice } from './device';
import type { IPlayerDetails } from './player';

export interface ILoginResponse {
  expiry: number;
  refresh_expiry: number;
  refresh: string;
  code: number;
  message: string;
  data: string;
}

export interface ILoginPhoneLogin {
  password: string;
  phone: string;
}

export interface ILoginUsernameLogin {
  password: string;
  player_id: string;
}

export interface IRegisterPlayer {
  agreement: boolean;
  invitation_code: string;
  password: string;
  phone: string;
  agent_code?: string;
}

export interface IForgotSms {
  username: string;
  phone: string;
}

export interface IForgotEmail {
  username: string;
  email: string;
}

export interface IResetPasswordSms {
  username: string;
  mobile: string;
  otp: string;
  newPassword: string;
  password_confirmation: string;
  // guid: string;
}

export interface IResetPasswordEmail {
  username: string;
  email: string;
  newPassword: string;
  password_confirmation: string;
  otp: string;
}

export interface IResetPassword {
  newPassword: string;
  password_confirmation: string;
  otp: string;
}

export interface ITelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface ITelegramLoginRes extends ILoginResponse {
  player_info: Partial<IPlayerDetails>;
}

export interface ITelegramLoginPayload extends IDevice, ITelegramUser {
  agent_code?: string;
  bot_name: string;
}

export interface ISsoLoginPayload extends IDevice {
  provider: 'google';
  sso_id: string;
  email?: string;
  name?: string;
  avatar?: string;
  access_token: string;
  raw_provider_data: unknown;
}

export interface IAppsFlyerPayload {
  player_id: string;
  event_name: string;
}
