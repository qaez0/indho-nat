import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import type { IRebateReport, IEarningHistoryItem } from '../../../types/invite';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CalendarIcon from '../../../assets/icons/calendar.svg';
import SearchIcon from '../../../assets/icons/search-icon.svg';

interface RewardsTabProps {
  rebateReportResult: any;
  earningHistoryResult: any;
  dateRange: { startDate: Date; endDate: Date };
  setDateRange: (dateRange: { startDate: Date; endDate: Date }) => void;
}

export const RewardsTab: React.FC<RewardsTabProps> = ({
  rebateReportResult,
  earningHistoryResult,
  dateRange,
  setDateRange,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartDatePicker, setIsStartDatePicker] = useState(true);
  const [isCleared, setIsCleared] = useState(false);

  const showDatePicker = (isStart: boolean) => {
    setIsStartDatePicker(isStart);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    if (isStartDatePicker) {
      setDateRange({ ...dateRange, startDate: date });
    } else {
      setDateRange({ ...dateRange, endDate: date });
    }
    setIsCleared(false);
    hideDatePicker();
  };

  const rebateReportData = rebateReportResult.data?.data as IRebateReport;
  const earningHistoryData =
    (earningHistoryResult.data?.data?.data as IEarningHistoryItem[]) || [];

  const rebateReportStats = [
    {
      title: t('invite.daily-invite-reward-tab.reward-tab.rebate-reward'),
      value: rebateReportData?.total_reward_amount ?? 0,
    },
    {
      title: t('invite.daily-invite-reward-tab.reward-tab.reward-rate'),
      value: rebateReportData?.reward_percentage
        ? `${rebateReportData.reward_percentage}%`
        : '0%',
    },
    {
      title: t('invite.daily-invite-reward-tab.reward-tab.direct-total-bet'),
      value: rebateReportData?.total_overall_bet ?? 0,
    },
    { title: t('invite.daily-invite-reward-tab.reward-tab.active-members'), value: rebateReportData?.active_member ?? 0 },
  ];

  return (
    <ScrollView
      style={styles.tabContent}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled>
      <View style={styles.datePickerCard}>
        <Text style={styles.datePickerCaption}>
        {t('invite.daily-invite-reward-tab.reward-tab.date-picker-caption')}
        </Text>
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={styles.dateInputContainer}
            onPress={() => showDatePicker(true)}>
            <CalendarIcon width={16} height={16} fill={'#F3B867'} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.dateInput}
              value={isCleared ? '' : `${dayjs(dateRange.startDate).format(
                'YYYY-MM-DD',
              )} - ${dayjs(dateRange.endDate).format('YYYY-MM-DD')}`}
              placeholder=""
              placeholderTextColor="#666"
              editable={false}
            />
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setIsCleared(true)}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.searchButton,
              { backgroundColor: theme['color-success-500'] },
            ]}>
            <SearchIcon width={18} height={18} fill="#fff" />
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          date={isStartDatePicker ? dateRange.startDate : dateRange.endDate}
        />

        <View style={styles.statsGrid}>
          {rebateReportStats.map((stat, index) => (
            <View key={index} style={styles.statBox}>
              <Text style={styles.statTitle}>{stat.title}</Text>
              {rebateReportResult.isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.statValue}>{stat.value}</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.usersContainer}>
          <View style={styles.userRow}>
            <Text style={styles.userHeaderText}>{t('invite.daily-invite-reward-tab.reward-tab.user')}</Text>
            <View style={styles.userRowDivider} />
            <Text style={styles.userHeaderText}>{t('invite.daily-invite-reward-tab.reward-tab.bet-amount')}</Text>
          </View>
          {rebateReportResult.isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : rebateReportData?.active_members?.length > 0 ? (
            rebateReportData.active_members.map((member, i) => (
              <View key={i} style={styles.userRow}>
                <Text style={styles.tableCellText}>{member.player_id}</Text>
                <View style={styles.userRowDivider} />
                <Text style={styles.tableCellText}>{member.bet_amount}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>{t('invite.daily-invite-reward-tab.reward-tab.no-history-found')}</Text>
          )}
        </View>
      </View>

      <View style={styles.earningHistorySection}>
        <View style={styles.titleDividerContainer}>
          <View style={styles.titleDivider} />
          <Text style={styles.earningHistoryTitle}>{t('invite.daily-invite-reward-tab.reward-tab.earning-history')}</Text>
          <View style={styles.titleDivider} />
        </View>

        {earningHistoryResult.isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : earningHistoryData?.length > 0 ? (
          earningHistoryData.map((item, index) => (
            <View key={index} style={styles.earningHistoryCard}>
              <View style={styles.earningRow}>
                <Text style={styles.earningLabel}>{t('invite.daily-invite-reward-tab.reward-tab.date')}:</Text>
                <Text style={styles.earningValue}>{item.date?.replace('T', ' ')}</Text>
              </View>
              <View style={styles.earningRow}>
                <Text style={styles.earningLabel}>{t('invite.daily-invite-reward-tab.reward-tab.amount')}:</Text>
                <Text style={styles.earningValue}>{item.reward_amount}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>{t('invite.daily-invite-reward-tab.reward-tab.no-earning-history-found')}</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  datePickerCard: {
    backgroundColor: '#272727',
    borderRadius: 10,
    padding: 15,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
  },
  datePickerCaption: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  dateInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingHorizontal: 8,
    borderWidth: 0,
  },
  calendarIcon: {
    fontSize: 16,
    marginRight: 8,
    color: 'white',
  },
  dateInput: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    color: '#ccc',
    fontSize: 11,
    fontWeight: 'bold',
  },
  searchButton: {
    width: 40,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 15,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#1d1d1d',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  usersContainer: {
    backgroundColor: '#1d1d1d',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    padding: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userHeaderText: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    textAlign: 'center',
  },
  userRowDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
  },
  tableCellText: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  noDataText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 10,
  },
  earningHistorySection: {
    gap: 15,
    marginBottom: 16,
  },
  titleDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleDivider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  earningHistoryTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  earningHistoryCard: {
    backgroundColor: '#272727',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    padding: 16,
    gap: 8,
  },
  earningRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earningLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    fontWeight: '400',
  },
  earningValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
