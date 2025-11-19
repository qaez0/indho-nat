export type WithdrawType = {
  amount: number;
  withdraw_password: string;
};

export interface IOtpState {
  lastSent: string | null;
  setLastSent: () => void;
  clearLastSent: () => void;
}

export type WithdrawRequest = {
  card_id: string;
  amount: number;
  withdraw_password: string;
  phone: string
}