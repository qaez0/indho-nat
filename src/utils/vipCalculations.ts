import { IVIPData, IVIPDetails } from '../types/player';
import { 
  ProcessedVIPLevel, 
  VIPUserInfo, 
  VIP_REQUIREMENTS, 
  VIP_BACKGROUNDS 
} from '../types/vip';

// Transform API VIP data to mobile format (same logic as web version)
export const transformVipData = (apiVipData: IVIPData): { [key: string]: IVIPDetails } => {
  const transformed: { [key: string]: IVIPDetails } = {};
  
  Object.entries(apiVipData).forEach(([key, details]) => {
    transformed[key] = {
      ...details,
      deposit_progress: Number(details.deposit_progress),
    };
  });
  
  return transformed;
};

// Get all bonus values from API data if available, otherwise use defaults
export const getAllBonusValues = (vipLevel: number, vipApiData?: IVIPData) => {
  const vipKey = `VIP ${vipLevel}`;
  const apiData = vipApiData?.[vipKey];
  
  if (apiData) {
    return {
      weeklyCashback: 0, // Default value since property doesn't exist
      extraDepositBonus: 0, // Default value since property doesn't exist
      bonusTurnover1: 1, // Default value since property doesn't exist
      bonusTurnover2: 1, // Default value since property doesn't exist
      minLossReq: apiData.bet_requirement || 0,
      minDepositReq: getVipRequirement(vipLevel), // Use VIP requirement
      maxBonus: 0, // Default value since property doesn't exist
      dailyClaimTimes: 0, // Default value since property doesn't exist
    };
  }
  
  // Fallback to default values (matching web version exactly)
  switch (vipLevel) {
    case 0: return {
      weeklyCashback: 0, extraDepositBonus: 0, bonusTurnover1: 0, bonusTurnover2: 0,
      minLossReq: 0, minDepositReq: 0, maxBonus: 0, dailyClaimTimes: 0
    };
    case 1: return {
      weeklyCashback: 5.0, extraDepositBonus: 0.5, bonusTurnover1: 1, bonusTurnover2: 1,
      minLossReq: 2025, minDepositReq: 2000, maxBonus: 1000, dailyClaimTimes: 5
    };
    case 2: return {
      weeklyCashback: 5.5, extraDepositBonus: 1.0, bonusTurnover1: 1, bonusTurnover2: 1,
      minLossReq: 2025, minDepositReq: 2000, maxBonus: 1000, dailyClaimTimes: 5
    };
    case 3: return {
      weeklyCashback: 6.0, extraDepositBonus: 1.5, bonusTurnover1: 1, bonusTurnover2: 1,
      minLossReq: 2025, minDepositReq: 2000, maxBonus: 1000, dailyClaimTimes: 5
    };
    case 4: return {
      weeklyCashback: 6.5, extraDepositBonus: 2.0, bonusTurnover1: 1, bonusTurnover2: 1,
      minLossReq: 2025, minDepositReq: 2000, maxBonus: 1000, dailyClaimTimes: 5
    };
    case 5: return {
      weeklyCashback: 7.0, extraDepositBonus: 2.5, bonusTurnover1: 1, bonusTurnover2: 1,
      minLossReq: 2025, minDepositReq: 2000, maxBonus: 1000, dailyClaimTimes: 5
    };
    case 6: return {
      weeklyCashback: 8.0, extraDepositBonus: 3.0, bonusTurnover1: 1, bonusTurnover2: 1,
      minLossReq: 2025, minDepositReq: 2000, maxBonus: 1000, dailyClaimTimes: 5
    };
    default: return {
      weeklyCashback: 0, extraDepositBonus: 0, bonusTurnover1: 0, bonusTurnover2: 0,
      minLossReq: 0, minDepositReq: 0, maxBonus: 0, dailyClaimTimes: 0
    };
  }
};

// Keep the old function for backward compatibility
export const getBonusValues = (vipLevel: number, vipApiData?: IVIPData) => {
  const allValues = getAllBonusValues(vipLevel, vipApiData);
  return {
    weekly: allValues.weeklyCashback,
    extra: allValues.extraDepositBonus,
  };
};

// Get VIP requirement for a specific level
export const getVipRequirement = (level: number): number => {
  return VIP_REQUIREMENTS[level] || 0;
};

// Get VIP background color for a specific level
export const getVipBackground = (level: number): string => {
  return VIP_BACKGROUNDS[level] || VIP_BACKGROUNDS[0];
};

// Calculate progress for a VIP level (ported from web VipCard logic)
export const calculateVipProgress = (
  vipLevel: number,
  currentUserVipLevel: number,
  currentUserDeposit: number
): number => {
  // If this is VIP 6 (highest level), no progress bar needed
  if (vipLevel >= 6) return 100;

  // If user's current VIP level is higher than this card, show 100%
  if (currentUserVipLevel > vipLevel) {
    return 100;
  }

  // If user's current VIP level equals this card, show progress toward next level
  if (currentUserVipLevel === vipLevel) {
    const nextLevelRequirement = getVipRequirement(vipLevel + 1);
    const currentLevelRequirement = getVipRequirement(vipLevel);
    
    if (nextLevelRequirement === 0) return 100;
    
    // Calculate progress from current level to next level
    const progressFromCurrentLevel = currentUserDeposit - currentLevelRequirement;
    const requiredForNextLevel = nextLevelRequirement - currentLevelRequirement;
    
    if (requiredForNextLevel <= 0) return 100;
    
    const progress = Math.min((progressFromCurrentLevel / requiredForNextLevel) * 100, 100);
    return Math.max(progress, 0);
  }

  // If user's current VIP level is lower than this card, show partial progress if deposit qualifies
  if (currentUserVipLevel < vipLevel) {
    const thisLevelRequirement = getVipRequirement(vipLevel);
    
    // If user hasn't reached this level's minimum, show 0%
    if (currentUserDeposit < thisLevelRequirement) {
      return 0;
    }
    
    // If user has enough deposit for this level but isn't officially this level yet,
    // show progress toward next level
    const nextLevelRequirement = getVipRequirement(vipLevel + 1);
    if (nextLevelRequirement === 0) return 100;
    
    const progressFromThisLevel = currentUserDeposit - thisLevelRequirement;
    const requiredForNextLevel = nextLevelRequirement - thisLevelRequirement;
    
    if (requiredForNextLevel <= 0) return 100;
    
    const progress = Math.min((progressFromThisLevel / requiredForNextLevel) * 100, 100);
    return Math.max(progress, 0);
  }

  return 0;
};

// Process raw VIP data into mobile-friendly format
export const processVipData = (
  rawVipData: IVIPData,
  currentUserDeposit: number,
  currentUserVipLevel: number
): ProcessedVIPLevel[] => {
  const transformedData = transformVipData(rawVipData);
  
  // Sort VIP entries by level
  const vipEntries = Object.entries(transformedData).sort(([a], [b]) => {
    const vipA = parseInt(a.replace(/[^0-9]/g, ''), 10);
    const vipB = parseInt(b.replace(/[^0-9]/g, ''), 10);
    return vipA - vipB;
  });

  return vipEntries.map(([key, details]) => {
    const level = parseInt(key.replace(/[^0-9]/g, ''), 10);
    const allBonusValues = getAllBonusValues(level, rawVipData);
    
    return {
      level,
      details,
      isActive: false, // Will be set by the slider component
      isCurrent: details.status === 'CURRENT',
      isTarget: false, // TARGET status doesn't exist in the interface
      progressPercentage: calculateVipProgress(level, currentUserVipLevel, currentUserDeposit),
      depositRequirement: getVipRequirement(level + 1),
      nextLevelRequirement: level < 6 ? getVipRequirement(level + 1) : undefined,
      
      // All table data fields
      weeklyCashback: allBonusValues.weeklyCashback,
      extraDepositBonus: allBonusValues.extraDepositBonus,
      bonusTurnover1: allBonusValues.bonusTurnover1,
      bonusTurnover2: allBonusValues.bonusTurnover2,
      minLossReq: allBonusValues.minLossReq,
      minDepositReq: allBonusValues.minDepositReq,
      maxBonus: allBonusValues.maxBonus,
      dailyClaimTimes: allBonusValues.dailyClaimTimes,
    };
  });
};

// Get user VIP info from processed data
export const getUserVipInfo = (
  processedLevels: ProcessedVIPLevel[],
  currentUserDeposit: number
): VIPUserInfo => {
  const currentLevel = processedLevels.find(level => level.isCurrent)?.level || 0;
  const targetLevel = processedLevels.find(level => level.isTarget)?.level;
  
  return {
    currentLevel,
    currentDeposit: currentUserDeposit,
    totalLevels: processedLevels.length,
    targetLevel,
  };
};

// Get initial slide index (same logic as web)
export const getInitialSlideIndex = (processedLevels: ProcessedVIPLevel[]): number => {
  const targetIndex = processedLevels.findIndex(level => level.isTarget);
  const currentIndex = processedLevels.findIndex(level => level.isCurrent);
  
  return targetIndex !== -1 ? targetIndex : (currentIndex !== -1 ? currentIndex : 0);
};
