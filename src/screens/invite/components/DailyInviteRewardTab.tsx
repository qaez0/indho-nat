import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { AboutTab } from './AboutTab';
import { InviteLinkTab } from './InviteLinkTab';
import { RewardsTab } from './RewardsTab';
import AboutIcon from '../../../assets/common/bonus/about-icon.svg';
import AboutIconActive from '../../../assets/common/bonus/about-icon-active.svg';
import InviteLinkIcon from '../../../assets/common/bonus/invite-link-icon.svg';
import InviteLinkIconActive from '../../../assets/common/bonus/invite-link-icon-active.svg';
import RewardIcon from '../../../assets/common/bonus/reward-icon.svg';
import RewardIconActive from '../../../assets/common/bonus/reward-icon-active.svg';

type SubTabType = 'about' | 'inviteLink' | 'rewards';

interface DailyInviteRewardTabProps {
  activeSubTab: SubTabType;
  setActiveSubTab: (tab: SubTabType) => void;
  rebateSettingResult: any;
  inviteLink: string;
  copied: boolean;
  handleCopyLink: () => void;
  rebateReportTotalResult: any;
  rebateReportResult: any;
  earningHistoryResult: any;
  dateRange: { startDate: Date; endDate: Date };
  setDateRange: (dateRange: { startDate: Date; endDate: Date }) => void;
}

const SubTabButton = ({
  tab,
  label,
  isActive,
  onPress,
}: {
  tab: SubTabType;
  label: string;
  isActive: boolean;
  onPress: () => void;
}) => {
  const theme = useTheme();
  
  const renderIcon = () => {
    switch (tab) {
      case 'about':
        return isActive ? (
          <AboutIconActive width={16} height={16} fill={theme['color-success-500']} />
        ) : (
          <AboutIcon width={16} height={16} fill="#FFFFFF" />
        );
      case 'inviteLink':
        return isActive ? (
          <InviteLinkIconActive width={16} height={16} fill={theme['color-success-500']} />
        ) : (
          <InviteLinkIcon width={16} height={16} fill="#FFFFFF" />
        );
      case 'rewards':
        return isActive ? (
          <RewardIconActive width={16} height={16} fill={theme['color-success-500']} />
        ) : (
          <RewardIcon width={16} height={16} fill="#FFFFFF" />
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.subTabButton, isActive && styles.activeSubTab]}
      onPress={onPress}>
      {renderIcon()}
      <Text
        style={[
          styles.subTabText,
          { color: isActive ? theme['color-success-500'] : '#FFFFFF' },
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const DailyInviteRewardTab: React.FC<DailyInviteRewardTabProps> = ({
  activeSubTab,
  setActiveSubTab,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.subTabsContainer}>
        <SubTabButton
          tab="about"
          label={t('invite.daily-invite-reward-tab.about-tab.title')}
          isActive={activeSubTab === 'about'}
          onPress={() => setActiveSubTab('about')}
        />
        <SubTabButton
          tab="inviteLink"
          label={t('invite.daily-invite-reward-tab.invite-link-tab.invite-link')}
          isActive={activeSubTab === 'inviteLink'}
          onPress={() => setActiveSubTab('inviteLink')}
        />
        <SubTabButton
          tab="rewards"
          label={t('invite.daily-invite-reward-tab.reward-tab.title')}
          isActive={activeSubTab === 'rewards'}
          onPress={() => setActiveSubTab('rewards')}
        />
      </View>

      {activeSubTab === 'about' && (
        <AboutTab
          rebateSettingResult={props.rebateSettingResult}
          inviteLink={props.inviteLink}
          copied={props.copied}
          handleCopyLink={props.handleCopyLink}
        />
      )}
      {activeSubTab === 'inviteLink' && (
        <InviteLinkTab
          rebateReportTotalResult={props.rebateReportTotalResult}
          inviteLink={props.inviteLink}
          copied={props.copied}
          handleCopyLink={props.handleCopyLink}
        />
      )}
      {activeSubTab === 'rewards' && (
        <RewardsTab
          rebateReportResult={props.rebateReportResult}
          earningHistoryResult={props.earningHistoryResult}
          dateRange={props.dateRange}
          setDateRange={props.setDateRange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#272727',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 11,
    overflow: 'hidden',
  },
  subTabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRightWidth: 1,
    borderRightColor: '#2D2D2D',
  },
  activeSubTab: {
    borderRightWidth: 0,
  },
  subTabText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
