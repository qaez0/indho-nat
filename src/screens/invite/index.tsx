import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  // Alert,
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
  const [activeTimeFilter, setActiveTimeFilter] = useState<string>('Today');
  const [copiedInviteLink, setCopiedInviteLink] = useState(false);
  const [copiedRegisterLink, setCopiedRegisterLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().subtract(7, 'day').toDate(),
    endDate: dayjs().toDate(),
  });
  const theme = useTheme();
  const { isAuthenticated } = useUser();

  // Map filter value to API format
  const getApiTimeFilter = (filter: string): string => {
    switch (filter) {
      case 'Today':
        return 'today';
      case 'Yesterday':
        return 'yesterday';
      case 'All':
        return 'all';
      default:
        return 'today';
    }
  };

  const { results, isLoading } = useInvite(
    getApiTimeFilter(activeTimeFilter),
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

  const rawInviteLink = inviteLinkResult.isLoading
    ? ''
    : inviteLinkResult.error
    ? ''
    : inviteLinkResult.data?.data?.invite_link ?? 'https://11ic.pk';

  // Download link (used in the first input)
  const inviteLink = (() => {
    if (inviteLinkResult.isLoading) {
      return 'Loading...';
    }
    if (inviteLinkResult.error) {
      return 'Error fetching link';
    }

    if (!rawInviteLink) {
      return 'https://11ic.pk/';
    }

    try {
      // Parse the API invite link to extract the query parameter
      const url = new URL(rawInviteLink);
      const queryParams = url.search; // This includes the "?" and query string like "?i=elh5L18J5F"

      // Replace with current domain and add /download path
      return `https://11ic.pk/${queryParams}`;
    } catch {
      // If URL parsing fails, try to extract query params manually
      const queryMatch = rawInviteLink.match(/\?.*$/);
      const queryParams = queryMatch ? queryMatch[0] : '';
      return `https://11ic.pk/${queryParams}`;
    }
  })();

  // Registration link (homepage with invite code, used in the third input)
  const registerLink = (() => {
    if (inviteLinkResult.isLoading) {
      return 'Loading...';
    }
    if (inviteLinkResult.error) {
      return 'Error fetching link';
    }
    return 'https://11ic.pk/download';
  })();

  // Extract invite code from invite link
  const inviteCode = (() => {
    if (inviteLinkResult.isLoading) {
      return 'Loading...';
    }
    if (inviteLinkResult.error) {
      return 'Error fetching code';
    }

    if (!rawInviteLink) {
      return '';
    }

    try {
      const url = new URL(rawInviteLink);
      return url.searchParams.get('i') || '';
    } catch {
      // If URL parsing fails, try to extract manually
      const match = rawInviteLink.match(/[?&]i=([^&]*)/);
      return match ? match[1] : '';
    }
  })();

  const handleCopyInviteLink = async () => {
    if (
      !inviteLink ||
      inviteLink === 'Loading...' ||
      inviteLink === 'Error fetching link'
    ) {
      return;
    }

    try {
      Clipboard.setString(inviteLink);
      setCopiedInviteLink(true);
      setTimeout(() => setCopiedInviteLink(false), 2000);
      Toast.show({
        type: 'success',
        text1: 'Invite link copied to clipboard',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to copy invite link',
      });
    }
  };

  const handleCopyRegisterLink = async () => {
    if (
      !registerLink ||
      registerLink === 'Loading...' ||
      registerLink === 'Error fetching link'
    ) {
      return;
    }

    try {
      Clipboard.setString(registerLink);
      setCopiedRegisterLink(true);
      setTimeout(() => setCopiedRegisterLink(false), 2000);
      Toast.show({
        type: 'success',
        text1: 'Register link copied to clipboard',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to copy register link',
      });
    }
  };

  const handleCopyCode = async () => {
    if (
      !inviteCode ||
      inviteCode === 'Loading...' ||
      inviteCode === 'Error fetching code'
    ) {
      return;
    }

    try {
      Clipboard.setString(inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      Toast.show({
        type: 'success',
        text1: 'Invite code copied to clipboard',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to copy invite code',
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
          inviteLink={inviteLink}
          registerLink={registerLink}
          inviteCode={inviteCode}
          copiedInviteLink={copiedInviteLink}
          copiedRegisterLink={copiedRegisterLink}
          copiedCode={copiedCode}
          handleCopyInviteLink={handleCopyInviteLink}
          handleCopyRegisterLink={handleCopyRegisterLink}
          handleCopyCode={handleCopyCode}
        />
      )}
      {activeMainTab === 'daily-invite-reward' && (
        <DailyInviteRewardTab
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
          rebateSettingResult={rebateSettingResult}
          inviteLink={inviteLink}
          registerLink={registerLink}
          inviteCode={inviteCode}
          copiedInviteLink={copiedInviteLink}
          copiedRegisterLink={copiedRegisterLink}
          copiedCode={copiedCode}
          handleCopyInviteLink={handleCopyInviteLink}
          handleCopyRegisterLink={handleCopyRegisterLink}
          handleCopyCode={handleCopyCode}
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
