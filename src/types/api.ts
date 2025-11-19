import { IMessageRecordItem } from './message';
import type {
  IPaymentChannelsGroup,
  IPlayerCardInfo,
  IPlayerDetails,
  IPlayerTransactionInfo,
  IVIPData,
} from './player';

export interface IBaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface IPanelInfoResponse {
  bank_info: IPlayerCardInfo[];
  player_info: IPlayerDetails;
  transaction_info: IPlayerTransactionInfo;
  payment_channels_group: IPaymentChannelsGroup;
  vip?: IVIPData; // VIP data is optional
  messageRecord: IMessageRecordItem[];
  unread_message_count: number;
}

export interface IBaseBody {
  device?: number;
  fp?: string;
  ipaddress?: string;
}

export interface IAuthToken {
  auth_token: string;
  refresh_token: string;
  refresh_expiry: number;
  auth_expiry: number;
}

//Api Types from other project
export interface BaseProps<TParams, TData, TOptions> {
  params: TParams;
  data: TData;
  options: TOptions;
}

export interface Params {
  ipaddress?: string;
  fp?: string;
  device?: string;
}

export interface Data {
  ipaddress: string | undefined;
  fp: string | undefined;
  device: number | undefined;
  data: {
    banner: [];
    game_platform: [];
    live_casino: [];
    rummy: [];
    support_payment: [];
    web_notice: [];
  };
}

export interface Options {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  customHeaders?: Record<string, string>;
}
