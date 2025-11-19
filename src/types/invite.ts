// Defines the shape of query parameters for API calls
export interface IQueryParams {
  Page: number;
  PageSize: number;
  start_date?: string;
  end_date?: string;
}

// --- Interface for Invite Bonus API Response ---
export interface RewardTier {
  minCount: number;
  maxCount: number;
  rewardAmount: number;
}

export interface InviteBonusData {
  totalIncome: number;
  totalInvites: number;
  invitationBonus: number;
  depositBonus: number;
  betBonus: number;
  eligibleRefers: number;
  rewardTiers: RewardTier[];
}

export interface InviteBonusResponse {
  code: number;
  message: string;
  data: InviteBonusData;
}
// --- End of Invite Bonus Interfaces ---

// --- Interface for Rebate Report API Response ---
export interface IRebateReport {
  total_reward_amount: number;
  reward_percentage: number;
  total_overall_bet: number;
  active_member: number;
  active_members: {
    player_id: string;
    bet_amount: string;
  }[];
}

// --- Interface for Invite Link API Response ---
export interface IInviteLinkData {
  invite_link: string;
}

export interface IInviteLinkResponse {
  code: number;
  message: string;
  data: IInviteLinkData;
}

// --- Interface for Earning History API Response ---
export interface IEarningHistoryItem {
  id: string;
  date: string;
  reward_amount: number;
}

export interface IEarningHistoryData {
  data: IEarningHistoryItem[];
  totalItems: number;
  currentPage: number;
  totalPage: number;
  pageSize: number;
}

export interface IEarningHistoryResponse {
  code: number;
  message: string;
  data: IEarningHistoryData;
}

// --- Interface for Rebate Setting API Response ---
export interface IRebateSettingItem {
  id: number;
  level: number;
  bet_amount: number;
  active_member: number;
  reward: number;
}

export interface IRebateSettingData {
  data: IRebateSettingItem[];
  totalItems: number;
  currentPage: number;
  totalPage: number;
  pageSize: number;
  totalAmount: number;
}

export interface IRebateSettingResponse {
  code: number;
  message: string;
  data: IRebateSettingData;
}
