import { ScrollView, View } from 'react-native';
import { Text, Spinner, useTheme } from '@ui-kitten/components';
import { vipStyles } from './components/vip.styles';

// Import components
import VipCardsSlider from './components/VipCardsSlider';
import BonusCardsSection from './components/BonusCardsSection';
import VipLevelsTable from './components/VipLevelsTable';
import TermsSection from './components/TermsSection';
import { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { HardCodedLevels } from '../../types/vip';

export default function VipScreen() {
  const theme = useTheme();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { user } = useUser();
  const levels = Object.values(user?.vip || {});
  const safeIndex = Math.min(
    Math.max(currentSlideIndex, 0),
    HardCodedLevels.length - 1,
  );
  const fallbackLevel = { weekly: 0, extra: 0 };
  const currentLevel = HardCodedLevels[safeIndex] || fallbackLevel;

  return (
    <ScrollView
      style={[vipStyles.container, { backgroundColor: theme['bg-secondary'] }]}
      contentContainerStyle={vipStyles.scrollContainer}
    >
      <VipCardsSlider
        levels={levels}
        setCurrentSlideIndex={setCurrentSlideIndex}
      />
      <BonusCardsSection
        weeklyCashback={currentLevel.weekly}
        extraDepositBonus={currentLevel.extra}
        currentVipLevel={safeIndex}
      />
      <VipLevelsTable />
      <TermsSection />
    </ScrollView>
  );
}
