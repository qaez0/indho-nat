export interface BonusTask extends Partial<Config> {
  id: number;
  title: string;
  desc: string;
  status: string;
  ios_en: number;
  pc_en: number;
  android_en: number;
  h5_en: number;
  img_link: any;
  content: string;
  start_time: string;
  end_time: string;
  misc: any;
  bonus_type: number | string;
  total_deposit_amount?: number;
  total_bet_amount?: number;
  remaing_coupons?: number;
}

export interface Config {
  sort: number;
  title: string;
  reward: string;
  end_time: string;
  goal_bet: string;
  min_loss: string;
  assoc_vip: string[];
  promo_type: string;
  repetition: string;
  start_time: string;
  max_deposit: string;
  min_deposit: string;
  goal_deposit: number;
  required_bet: number;
  assoc_game_id: any[];
  reward_percent: number;
  time_remaining: number;
  req_national_id: boolean;
  coupons_alotment: string;
  max_redeem_count: number;
  req_bank_account: boolean;
  req_phone_verify: boolean;
  distribute_method: string;
  remaining_coupons: number;
  time_before_start: number;
  max_daily_reward_amount: number;
  max_player_redeem_count: number;
  max_total_reward_amount: number;
  max_weekly_reward_amount: number;
  id: number;
}
