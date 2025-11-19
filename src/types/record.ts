// Pagination info type
export interface PaginationInfo {
  totalItems: number;
  currentPage: number;
  totalPage: number;
  pageSize: number;
  totalDeposit: number;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  totalPage: number;
  pageSize: number;
  totalDeposit: number;
}

// Base record interface
interface BaseRecord {
  status: string;
  request_time: string;
  orderid: string;
  amount: number;
  fee: number;
  attachment: string;
  device: string | null;
  ipaddress: string;
}

// Deposit record based on actual API response
export interface DepositRecord extends BaseRecord {
  currency_id: number;
  currency_xrate: number;
  platform_id: string;
}

// Withdrawal record (assuming similar structure)
export interface WithdrawRecord extends BaseRecord {
  currency_id: number;
  currency_xrate: number;
  transfer_amount?: number;
  bank_name?: string;
  bank_account_name?: string;
  bank_account_num?: string;
  payment_method?: string;
}

// Bonus record (assuming different structure for bonuses)
export interface BonusRecord {
  id: string;
  guid?: string;
  reward: number;
  status: string;
  request_time: string;
  review_time?: string;
  player_id?: string;
  remarks?: string;
  require_bet?: number;
}

export type AnyTransactionRecord = DepositRecord | WithdrawRecord | BonusRecord;

// Betting record interface
export interface BettingRecord {
  id: number;
  currency: string;
  game_id: string;
  game_type: string;
  bet_time: string;
  amount: number;
  status: string;
  bet_serial: string;
  win_loss: string;
}

// Lock record interface
export interface LockRecord {
  status: string;
  guid: string;
  amount: number;
  target_amount: number;
  lock_type: string; // e.g., "DEPOSIT", "PROMO", "RESIZE"
  lock_time?: string;
  create_time?: string;
  unlock_time?: string;
  bonus_id?: string;
}

// Lock record pagination parameters
export interface LockRecordPaging {
  page: number;      // 1-indexed for API
  pagesize: number;
  days_ago: number;
  lock_type?: string; // Optional filter by type
}
