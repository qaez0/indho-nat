import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Button,
  Text,
  useTheme,
  Select,
  SelectItem,
  IndexPath,
} from '@ui-kitten/components';
import Feather from '@react-native-vector-icons/feather';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  useBettingRecords,
  useBettingRecordState,
  type BettingGameType,
} from './useBettingRecords';
import type { BettingRecord } from '../../types/record';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomPagination from '../../components/Pagination';
import { useTranslation } from 'react-i18next';

const BettingRecordScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    activeTab,
    setActiveTab,
    selectedDays,
    setSelectedDays,
    currentPage,
    setCurrentPage,
    pageSize,
    expandedItems,
    toggleExpanded,
    resetPagination,
  } = useBettingRecordState();

  // Query for betting records with current filters
  const bettingQuery = useBettingRecords(
    selectedDays,
    activeTab,
    currentPage,
    pageSize,
  );

  const tabOptions = [
    { label: t('betting-record.all'), value: 'all' as BettingGameType },
    { label: t('betting-record.live-casino'), value: 'casino' as BettingGameType },
    { label: t('betting-record.slot'), value: 'slot' as BettingGameType },
    { label: t('betting-record.sports'), value: 'sports' as BettingGameType }
  ];

  const daysOptions = [3, 7];

  const onSelectDays = (index: IndexPath | IndexPath[]) => {
    if (index instanceof IndexPath) {
      setSelectedDays(daysOptions[index.row]);
      resetPagination();
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    bettingQuery.refetch();
  };

  const formatTimeWithoutYear = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    Toast.show({
      type: 'success',
      text1: 'Copied to clipboard!',
    });
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const renderBetDetails = (record: BettingRecord) => {
    const details: { label: string; value: string; isCopyable?: boolean }[] = [
      { label: 'Game ID', value: record.game_id },
      {
        label: 'Bet Amount',
        value: `${record.amount.toLocaleString()} ${record.currency}`,
      },
      { label: 'Bet Time', value: formatTimeWithoutYear(record.bet_time) },
      { label: 'Betting Slip', value: record.bet_serial, isCopyable: true },
    ];

    return details;
  };

  // Calculate total bet amount
  const totalBetAmount = React.useMemo(() => {
    return bettingQuery.records.reduce((acc, record) => {
      return acc + (record.amount || 0);
    }, 0);
  }, [bettingQuery.records]);

  const insets = useSafeAreaInsets().bottom;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={{ paddingBottom: insets }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={bettingQuery.isFetching && !bettingQuery.isLoading}
          onRefresh={handleRefresh}
          tintColor={theme['color-success-500']}
          colors={[theme['color-success-500']]}
        />
      }
    >
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>{t('betting-record.title')}</Text>

        {/* Tab Container */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
          style={{ marginBottom: 16 }}
        >
          {tabOptions.map(tab => (
            <TouchableOpacity
              key={tab.value}
              style={[
                styles.tabButton,
                {
                  backgroundColor:
                    activeTab === tab.value
                      ? theme['color-success-500']
                      : 'transparent',
                  borderColor: activeTab === tab.value ? 'transparent' : '#fff',
                },
              ]}
              onPress={() => {
                setActiveTab(tab.value);
                resetPagination();
              }}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  {
                    color: activeTab === tab.value ? '#23272f' : '#fff',
                    fontWeight: activeTab === tab.value ? 'bold' : 'normal',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Filter Container */}
        <Select
          style={styles.filterContainer}
          value={`${selectedDays} Days`}
          selectedIndex={new IndexPath(daysOptions.indexOf(selectedDays))}
          onSelect={onSelectDays}
          accessoryLeft={props => (
            <Image
              // eslint-disable-next-line react/prop-types
              style={{ width: 16, height: 16, marginRight: 8 }}
              source={{ uri: '/images/common/transaction/union.png' }}
            />
          )}
        >
          {daysOptions.map(days => (
            <SelectItem key={days} title={`${days} Days`} />
          ))}
        </Select>

        {/* Total Bet Amount Display */}
        <View style={styles.totalAmountContainer}>
          <Text
            style={[
              styles.totalAmountLabel,
              { color: theme['color-success-500'] },
            ]}
          >
            {t('betting-record.total-bet')}
          </Text>
          <Text style={styles.totalAmountValue}>
            {totalBetAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            {bettingQuery.records.length > 0
              ? bettingQuery.records[0]?.currency || 'PKR'
              : 'PKR'}
          </Text>
        </View>

        {/* Loading State */}
        {bettingQuery.isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={theme['color-success-500']}
            />
            <Text style={styles.loadingText}>
              {t('betting-record.loading-betting-records')}
            </Text>
          </View>
        )}

        {/* Error State */}
        {bettingQuery.error && !bettingQuery.isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {t('betting-record.failed-to-load-betting-records')}
            </Text>
            <Button
              appearance="outline"
              status="basic"
              size="small"
              onPress={() => bettingQuery.refetch()}
              style={styles.retryButton}
            >
              {t('betting-record.retry')}
            </Button>
          </View>
        )}

        {/* Records List */}
        {!bettingQuery.isLoading && !bettingQuery.error && (
          <View style={styles.recordsList}>
            {bettingQuery.records.length === 0 ? (
              <View style={styles.noRecordsContainer}>
                <Text style={styles.noRecordsText}>
                  {t('betting-record.no-betting-records-found')}
                </Text>
              </View>
            ) : (
              bettingQuery.records.map(record => (
                <View key={record.id} style={styles.recordCard}>
                  {/* Summary */}
                  <TouchableOpacity
                    style={styles.recordSummary}
                    onPress={() => toggleExpanded(record.id.toString())}
                  >
                    <View style={styles.recordSummaryContent}>
                      <View style={styles.recordLeft}>
                        <Text style={styles.recordTime}>
                          {formatTimeWithoutYear(record.bet_time)}
                        </Text>
                        <Text style={styles.recordTypeLabel}>
                          Type:{' '}
                          <Text style={styles.recordTypeValue}>
                            {record.game_type}
                          </Text>
                        </Text>
                      </View>
                      <View style={styles.recordRight}>
                        <View style={styles.amountContainer}>
                          <Image
                            source={require('../../assets/drawer/wallet-coin.png')}
                            style={styles.coinIcon}
                          />
                          <Text
                            style={[
                              styles.recordAmount,
                              {
                                color:
                                  parseFloat(record.win_loss) >= 0
                                    ? '#31bc69'
                                    : '#f14a61',
                              },
                            ]}
                          >
                            {record.win_loss} {record.currency}
                          </Text>
                        </View>
                        <Text style={styles.recordStatusLabel}>
                          Status:{' '}
                          <Text style={styles.recordStatusValue}>
                            {formatStatus(record.status)}
                          </Text>
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.expandIcon}>
                      <Feather
                        name={
                          expandedItems.has(record.id.toString())
                            ? 'chevron-down'
                            : 'chevron-up'
                        }
                        size={20}
                        color="white"
                      />
                    </Text>
                  </TouchableOpacity>

                  {/* Details */}
                  {expandedItems.has(record.id.toString()) && (
                    <View style={styles.recordDetails}>
                      {renderBetDetails(record).map((detail, index) => (
                        <View key={index} style={styles.detailRow}>
                          <Text style={styles.detailLabel}>
                            {detail.label}:
                          </Text>
                          <View style={styles.detailValueContainer}>
                            <Text
                              style={[
                                styles.detailValue,
                                detail.label === 'Betting Slip' &&
                                  styles.detailValueBreak,
                              ]}
                            >
                              {detail.value}
                            </Text>
                            {detail.isCopyable && (
                              <TouchableOpacity
                                style={[
                                  styles.copyButton,
                                  {
                                    backgroundColor: theme['color-success-500'],
                                  },
                                ]}
                                onPress={() => handleCopy(detail.value)}
                              >
                                <Text style={styles.copyIcon}>📋</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}
      </View>
      {bettingQuery.records.length > 0 &&
        bettingQuery.pagination.totalPage > 1 && (
          <View style={{ marginBottom: 30, marginTop: 20 }}>
            <CustomPagination
              totalItems={bettingQuery.pagination.totalItems}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={page => {
                setCurrentPage(page);
              }}
            />
          </View>
        )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: 5,
  },
  scrollView: {
    flex: 1,
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  tabButton: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tabButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  filterContainer: {
    backgroundColor: '#2f2f2f',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#393939',
    marginBottom: 16,
  },
  totalAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#393939',
    marginBottom: 16,
  },
  totalAmountLabel: {
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  totalAmountValue: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '300',
    marginLeft: 8,
  },
  filterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterIcon: {
    width: 16,
    height: 16,
  },
  filterText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  daysOptionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dayOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
  },
  dayOptionText: {
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  recordsList: {
    gap: 12,
  },
  noRecordsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  noRecordsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  recordCard: {
    backgroundColor: '#232323',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#393939',
    overflow: 'hidden',
  },
  recordSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#393939',
  },
  recordSummaryContent: {
    flex: 1,
    flexDirection: 'row',
  },
  recordLeft: {
    flex: 1,
  },
  recordTime: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '400',
    marginBottom: 4,
  },
  recordTypeLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '400',
  },
  recordTypeValue: {
    color: '#ffffff',
  },
  recordRight: {
    flex: 1,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  coinIcon: {
    width: 12,
    height: 12,
    marginLeft: 28,
  },
  recordAmount: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '400',
  },
  recordStatusLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '400',
    marginLeft: 28,
  },
  recordStatusValue: {
    color: '#fff',
    textTransform: 'capitalize',
  },
  expandIcon: {
    color: '#a7a7a7',
    fontSize: 20,
    marginLeft: 16,
  },
  recordDetails: {
    padding: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
    gap: 8,
    flexWrap: 'wrap',
  },
  detailLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    flexShrink: 0,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  detailValue: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    flex: 1,
  },
  detailValueBreak: {
    // For betting slip - allow text to break
    flexWrap: 'wrap',
  },
  copyButton: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  copyIcon: {
    fontSize: 8,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    gap: 16,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    gap: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 100,
  },
});

export default BettingRecordScreen;
