// Re-export existing VIP types from player.ts
export type { IVIPDetails, IVIPData } from './player';

// Mobile-specific VIP interfaces
export interface ProcessedVIPLevel {
  level: number;
  details: IVIPDetails;
  isActive: boolean;
  isCurrent: boolean;
  isTarget: boolean;
  progressPercentage: number;
  depositRequirement: number;
  nextLevelRequirement?: number;

  // All table data fields (matching web version)
  weeklyCashback: number; // casinoslots_cashback
  extraDepositBonus: number; // deposit_extra_bonus
  bonusTurnover1: number; // bonus_turnover
  bonusTurnover2: number; // bonus_turnover (same value)
  minLossReq: number; // bet_requirement
  minDepositReq: number; // derived from deposit_requirement
  maxBonus: number; // max_bonus_amount
  dailyClaimTimes: number; // daily_claim_times
}

export interface VIPUserInfo {
  currentLevel: number;
  currentDeposit: number;
  totalLevels: number;
  targetLevel?: number;
}

export interface VIPBonusInfo {
  weekly: number;
  extra: number;
  background: string;
}

export interface ProcessedVIPData {
  levels: ProcessedVIPLevel[];
  userInfo: VIPUserInfo;
  currentSlideIndex: number;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Component prop interfaces
export interface VipCardProps {
  level: ProcessedVIPLevel;
  userInfo: VIPUserInfo;
  isActive: boolean;
  onPress?: () => void;
}

export interface VipSliderProps {
  levels: ProcessedVIPLevel[];
  userInfo: VIPUserInfo;
  setCurrentSlideIndex: (index: number) => void;
}

export interface BonusCardProps {
  title: string;
  percentage: string;
  background: string[];
}

export interface VipProgressDotsProps {
  totalDots: number;
  currentIndex: number;
  onDotPress: (index: number) => void;
}

// Full VIP table data structure (matching web version exactly)
export interface VipLevelData {
  level: string;
  totalDeposit: string;
  weeklyLossbackBonus: string;
  bonusTurnover1: string;
  minLossReq: string;
  depositExtraBonus: string;
  minDepositReq: string;
  maxBonus: string;
  bonusTurnover2: string;
  dailyClaimTimes: string;
}

// Table row configuration (matching web version)
export interface RowConfig {
  type: 'header' | 'data';
  label: string;
  key?: keyof VipLevelData;
}

// Table block configuration (matching web version)
export interface BlockConfig {
  rows: RowConfig[];
  isFirstBlock?: boolean;
}

// VIP table props
export interface VipLevelsTableProps {
  levels?: ProcessedVIPLevel[];
}

// VIP level requirements (same as web version)
export const VIP_REQUIREMENTS = [
  0, // VIP 0
  500, // VIP 1
  200000, // VIP 2
  1000000, // VIP 3
  5000000, // VIP 4
  10000000, // VIP 5
  50000000, // VIP 6
] as const;

// VIP level backgrounds/gradients (will be converted to colors for RN)
export const VIP_BACKGROUNDS = [
  '#6B8095', // VIP 0
  '#596B92', // VIP 1
  '#886F68', // VIP 2
  '#606D85', // VIP 3
  '#887662', // VIP 4
  '#5D4B84', // VIP 5
  '#3E4087', // VIP 6
] as const;

// Import existing types that we need
import { IVIPDetails } from './player';

export const HardCodedLevels = [
  { weekly: 0.0, extra: 0.0 },
  { weekly: 5.0, extra: 0.5 },
  { weekly: 5.5, extra: 1.0 },
  { weekly: 6.0, extra: 1.5 },
  { weekly: 6.5, extra: 2.0 },
  { weekly: 7.0, extra: 2.5 },
  { weekly: 8.0, extra: 3.0 },
];
export const vipLevelsData: VipLevelData[] = [
  {
    level: 'VIP 0',
    totalDeposit: '-',
    weeklyLossbackBonus: '-',
    bonusTurnover1: '-',
    minLossReq: '-',
    depositExtraBonus: '-',
    minDepositReq: '-',
    maxBonus: '-',
    bonusTurnover2: '-',
    dailyClaimTimes: '-',
  },
  {
    level: 'VIP 1',
    totalDeposit: '≥500',
    weeklyLossbackBonus: '5.00%',
    bonusTurnover1: '1x',
    minLossReq: '≥2025',
    depositExtraBonus: '0.50%',
    minDepositReq: '≥2000',
    maxBonus: '1000',
    bonusTurnover2: '1x',
    dailyClaimTimes: '5',
  },
  {
    level: 'VIP 2',
    totalDeposit: '≥200,000',
    weeklyLossbackBonus: '5.50%',
    bonusTurnover1: '1x',
    minLossReq: '≥2025',
    depositExtraBonus: '1.00%',
    minDepositReq: '≥2000',
    maxBonus: '1000',
    bonusTurnover2: '1x',
    dailyClaimTimes: '5',
  },
  {
    level: 'VIP 3',
    totalDeposit: '≥1,000,000',
    weeklyLossbackBonus: '6.00%',
    bonusTurnover1: '1x',
    minLossReq: '≥2025',
    depositExtraBonus: '1.50%',
    minDepositReq: '≥2000',
    maxBonus: '1000',
    bonusTurnover2: '1x',
    dailyClaimTimes: '5',
  },
  {
    level: 'VIP 4',
    totalDeposit: '≥5,000,000',
    weeklyLossbackBonus: '6.5%',
    bonusTurnover1: '1x',
    minLossReq: '≥2025',
    depositExtraBonus: '2.00%',
    minDepositReq: '≥2000',
    maxBonus: '1000',
    bonusTurnover2: '1x',
    dailyClaimTimes: '5',
  },
  {
    level: 'VIP 5',
    totalDeposit: '≥10,000,000',
    weeklyLossbackBonus: '7.00%',
    bonusTurnover1: '1x',
    minLossReq: '≥2025',
    depositExtraBonus: '2.50%',
    minDepositReq: '≥2000',
    maxBonus: '1000',
    bonusTurnover2: '1x',
    dailyClaimTimes: '5',
  },
  {
    level: 'VIP 6',
    totalDeposit: '≥50,000,000',
    weeklyLossbackBonus: '8.00%',
    bonusTurnover1: '1x',
    minLossReq: '≥2025',
    depositExtraBonus: '3.00%',
    minDepositReq: '≥2000',
    maxBonus: '1000',
    bonusTurnover2: '1x',
    dailyClaimTimes: '5',
  },
];
