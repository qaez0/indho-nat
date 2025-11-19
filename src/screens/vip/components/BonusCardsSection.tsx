import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { BonusCardProps } from '../../../types/vip';
import { vipStyles } from './vip.styles';

// Individual Bonus Card component
const BonusCard: React.FC<BonusCardProps> = ({ title, percentage, background }) => {
  return (
    <LinearGradient
      colors={background}
      style={vipStyles.bonusCard}
    >
      <Text style={vipStyles.bonusTitle}>
        {title}
      </Text>
      <Text style={vipStyles.bonusPercentage}>
        {percentage}
      </Text>
    </LinearGradient>
  );
};

// Bonus Cards Section component
interface BonusCardsSectionProps {
  weeklyCashback: number;
  extraDepositBonus: number;
  currentVipLevel: number;
}

const BonusCardsSection: React.FC<BonusCardsSectionProps> = ({
  weeklyCashback,
  extraDepositBonus,
  currentVipLevel,
}) => {
  const { t } = useTranslation();
  
  // Get VIP background gradient colors based on current level
  const getVipBackground = (vipLevel: number) => {
    const backgrounds = [
      ['#6B8095', '#2C2732'], // VIP 0
      ['#596B92', '#2C2732'], // VIP 1
      ['#886F68', '#2C2732'], // VIP 2
      ['#606D85', '#2C2732'], // VIP 3
      ['#887662', '#2C2732'], // VIP 4
      ['#5D4B84', '#2C2732'], // VIP 5
      ['#3E4087', '#2C2732'], // VIP 6
    ];
    return backgrounds[vipLevel] || backgrounds[0];
  };

  const vipBackground = getVipBackground(currentVipLevel);

  return (
    <View style={vipStyles.bonusSection}>
      <View style={vipStyles.bonusCardsRow}>
        <BonusCard
          title={t('vip.weekly-cashback-bonus')}
          percentage={`${weeklyCashback % 1 === 0 ? weeklyCashback : weeklyCashback?.toFixed(1)}%`}
          background={vipBackground}
        />
        <BonusCard
          title={t('vip.extra-deposit-bonus')}
          percentage={`${extraDepositBonus % 1 === 0 ? extraDepositBonus : extraDepositBonus?.toFixed(1)}%`}
          background={vipBackground}
        />
      </View>
    </View>
  );
};

export default BonusCardsSection;
