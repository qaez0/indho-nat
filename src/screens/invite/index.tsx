import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { useInvite } from '../../hooks/useInvite';
import { useUser } from '../../hooks/useUser';
import dayjs from 'dayjs';
import Clipboard from '@react-native-clipboard/clipboard';
import { InviteEarnTab } from './components/InviteEarnTab';
import { DailyInviteRewardTab } from './components/DailyInviteRewardTab';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

type MainTab = 'invite-earn' | 'daily-invite-reward';
type SubTab = 'about' | 'inviteLink' | 'rewards';

const EarnScreen = () => {
  const { t } = useTranslation();
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('invite-earn');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('inviteLink');
  const [activeTimeFilter, setActiveTimeFilter] = useState<string>('today');
  const [copied, setCopied] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().subtract(7, 'day').toDate(),
    endDate: dayjs().toDate(),
  });
  const theme = useTheme();
  const { isAuthenticated } = useUser();

  const { results, isLoading } = useInvite(
    activeTimeFilter,
    {
      Page: 1,
      PageSize: 10,
      start_date: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
      end_date: dayjs(dateRange.endDate).format('YYYY-MM-DD'),
    },
    { Page: 1, PageSize: 10 },
  );

  const [
    inviteLinkResult,
    rebateReportTotalResult,
    earningHistoryResult,
    rebateSettingResult,
    rebateReportResult,
    inviteBonusResult,
  ] = results;

  const inviteLink = (): string => {
    const rawLink = inviteLinkResult.data?.data?.invite_link?.split('?')[1];
    if (!rawLink) {
      return 'https://11ic.pk/download/';
    }
    return `https://11ic.pk/download/?${rawLink}`;
  };

  const handleCopyLink = async () => {
    try {
      Clipboard.setString(inviteLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      Toast.show({
        type: 'success',
        text1: 'Invite link copied to clipboard',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to copy link',
      });
    }
  };

  const MainTabButton = ({
    tab,
    label,
    isActive,
  }: {
    tab: MainTab;
    label: string;
    isActive: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.mainTabButton,
        {
          backgroundColor: isActive ? theme['color-success-500'] : '#1a1a1a',
          borderWidth: isActive ? 0 : 1,
          borderColor: isActive ? 'transparent' : '#333',
        },
      ]}
      onPress={() => setActiveMainTab(tab)}
    >
      <Text
        style={[
          styles.mainTabText,
          {
            color: isActive ? '#23272f' : '#fff',
            fontWeight: isActive ? '700' : '500',
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading && !results.some(r => r.data)) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme['color-success-500']} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainTabsContainer}>
        <MainTabButton
          tab="invite-earn"
          label={t('invite.invite-earn')}
          isActive={activeMainTab === 'invite-earn'}
        />
        <MainTabButton
          tab="daily-invite-reward"
          label={t('invite.daily-invite-reward')}
          isActive={activeMainTab === 'daily-invite-reward'}
        />
      </View>

      {activeMainTab === 'invite-earn' && (
        <InviteEarnTab
          inviteBonusResult={inviteBonusResult}
          isAuthenticated={isAuthenticated}
          activeTimeFilter={activeTimeFilter}
          setActiveTimeFilter={setActiveTimeFilter}
          inviteLink={inviteLink()}
          copied={copied}
          handleCopyLink={handleCopyLink}
        />
      )}
      {activeMainTab === 'daily-invite-reward' && (
        <DailyInviteRewardTab
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
          rebateSettingResult={rebateSettingResult}
          inviteLink={inviteLink()}
          copied={copied}
          handleCopyLink={handleCopyLink}
          rebateReportTotalResult={rebateReportTotalResult}
          rebateReportResult={rebateReportResult}
          earningHistoryResult={earningHistoryResult}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#272727',
    borderRadius: 16,
    margin: 16,
    padding: 10,
    gap: 10,
  },
  mainTabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  mainTabText: {
    fontSize: 15,
    textTransform: 'capitalize',
  },
});

export default EarnScreen;
