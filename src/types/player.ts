export interface IPlayerCardInfo {
  card_type: 'BANK' | 'EWALLET' | 'CRYPTO';
  card_id: string;
  bank_account_number: string;
  bank_account_name: string;
  bank_account_num: string;
  bank_name: string;
  status: number;
  ifsc: string;
}

export type KYCStatus = 'PENDING' | 'APPROVE' | 'DECLINE';

export interface IPlayerDetails {
  email: string;
  phone: string;
  phone_validation: boolean;
  real_name: string;
  name: string;
  vip: string;
  player_id: string;
  birthday: string;
  gender: string;
  telegram_id: string;
  haspass: boolean;
  has_wallet_pass: boolean;
  kyc_id_status: KYCStatus | string;
  bank_id_status: KYCStatus | string;
}

export interface IPlayerTransactionInfo {
  overall_turnover_amount: number;
  remaining_turnover_amount: number;
}

export interface IBalanceResponse {
  [key: string]: number;
  total: number;
  wallet_bdt: number;
}

export interface IChannelGroup {
  group: string;
  channel_id: string;
  amount_options: number[];
  amount_editable: boolean;
  upload_proof: boolean;
  amount_min: number;
  amount_max: number;
  img_url: string;
  xrate: number;
  link: string;
  display_name: string;
  channels: string[] | null;
}

export interface IPaymentChannelsGroup {
  bankTransfer: IChannelGroup[];
  bankTransfer_upi: IChannelGroup[];
  onlinePay: IChannelGroup[];
  crypto: IChannelGroup[];
}

export type UpdateRealNameType = {
  real_name: string;
};

export type CreateWithdrawalPasswordType = {
  password: string;
};

export type RequestOtp = {
  phone: string;
};

export type VerfiyPhoneNumber = {
  otp: string;
};

export type ChangePasswordType = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

export type SetWalletPasswordType = {
  password: string;
  confirm_password: string;
};

export type VerifyPhoneNumberType = {
  phone: string;
};

export type VerifyEmailType = {
  email: string;
};

export type UpdateProfileType = {
  real_name: string;
  gender: string;
  birthday: string;
};

// VIP Related Types
export interface IVIPDetails {
  bet_requirement: number;
  deposit_requirement: number;
  deposit_amount: number;
  deposit_progress: number;
  start_time: string;
  status: 'DISABLED' | 'CURRENT';
}

export interface IVIPData {
  [key: string]: IVIPDetails; // e.g., "VIP 0", "VIP 1", etc.
}

export interface IAdjustId {
  adjust_id: string;
}

export interface IIsRegistered {
  phone: string;
  isRegistered: boolean;
  player_id: string;
}
