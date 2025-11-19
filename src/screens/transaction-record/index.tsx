import Clipboard from '@react-native-clipboard/clipboard';
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
import { useNavigation } from '@react-navigation/native';
import {
  useDepositRecords,
  useWithdrawalRecords,
  useBonusRecords,
  useTransactionRecordState,
  useCancelDepositRequest,
  type TransactionType,
  useAllTransactionRecords,
} from './useTransactionRecords';
import type {
  DepositRecord,
  WithdrawRecord,
  BonusRecord,
} from '../../types/record';
import { RootStackNav } from '../../types/nav';
import CustomPagination from '../../components/Pagination';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import { convertToPakistanTime } from '../../utils/pktime';

const TransactionRecordScreen = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<RootStackNav>();
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
  } = useTransactionRecordState();

  // Separate queries for each tab - now with pagination
  const depositQuery = useDepositRecords(selectedDays, currentPage, pageSize);
  const withdrawalQuery = useWithdrawalRecords(
    selectedDays,
    currentPage,
    pageSize,
  );
  const bonusQuery = useBonusRecords(selectedDays, currentPage, pageSize);
  const cancelDepositMutation = useCancelDepositRequest();
  const allRecordsQuery = useAllTransactionRecords(activeTab, selectedDays);

  const tabOptions = [
    { label: t('common-terms.deposit'), value: 'deposit' as TransactionType },
    {
      label: t('transaction-record.withdrawal'),
      value: 'withdrawal' as TransactionType,
    },
    { label: t('transaction-record.promo'), value: 'promo' as TransactionType },
  ];

  const daysOptions = [3, 7];

  // Handle cancel deposit request
  const handleCancelDeposit = async (orderId: string) => {
    try {
      await cancelDepositMutation.mutateAsync({
        orderid: orderId,
        // Add any additional required fields from IBaseBody if needed
      });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Deposit request cancelled successfully',
      });
      navigation.navigate('main-tabs', {
        screen: 'tabs',
        params: {
          screen: 'deposit-withdraw',
          params: {
            tab: 'deposit',
          },
        },
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to cancel deposit request',
      });
    }
  };

  // Handle continue payment - retrieve payment URL from storage and open it
  const handleContinuePayment = async () => {
    try {
      const paymentUrl = await AsyncStorage.getItem('pending_payment_url');

      if (paymentUrl) {
        // Open the payment URL
        const canOpen = await Linking.canOpenURL(paymentUrl);
        if (canOpen) {
          await Linking.openURL(paymentUrl);
          Toast.show({
            type: 'success',
            text1: 'Redirecting to payment...',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Invalid payment URL',
          });
        }
      }
    } catch (error) {
      console.error('Error retrieving payment URL:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to retrieve payment URL',
      });
    }
  };

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    Toast.show({
      type: 'success',
      text1: 'Copied to clipboard!',
    });
  };

  const onSelectDays = (index: IndexPath | IndexPath[]) => {
    if (index instanceof IndexPath) {
      setSelectedDays(daysOptions[index.row]);
      resetPagination();
    }
  };

  const activeQuery = React.useMemo(() => {
    switch (activeTab) {
      case 'deposit':
        return depositQuery;
      case 'withdrawal':
        return withdrawalQuery;
      case 'promo':
        return bonusQuery;
      default:
        return depositQuery;
    }
  }, [activeTab, depositQuery, withdrawalQuery, bonusQuery]);

  // Handle refresh for specific tab
  const handleRefresh = () => {
    switch (activeTab) {
      case 'deposit':
        depositQuery.refetch();
        break;
      case 'withdrawal':
        withdrawalQuery.refetch();
        break;
      case 'promo':
        bonusQuery.refetch();
        break;
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getDepositStatusColor = (status: string) => {
    const statusUpper = status.toUpperCase();
    if (statusUpper === 'APPROVE' || statusUpper === 'APPROVED') {
      return '#4caf50'; // Green
    }
    if (
      statusUpper === 'CANCELLED' ||
      statusUpper === 'CANCEL' ||
      statusUpper === 'DECLINE' ||
      statusUpper === 'DECLINED' ||
      statusUpper.includes('RISK')
    ) {
      return '#ff4444'; // Red
    }
    return '#fff'; // Default white
  };

  const getWithdrawalStatusColor = (status: string) => {
    const statusUpper = status.toUpperCase();
    if (
      statusUpper === 'APPROVE' ||
      statusUpper === 'APPROVED' ||
      statusUpper.includes('PAID')
    ) {
      return '#4caf50'; // Green
    }
    if (
      statusUpper === 'CANCELLED' ||
      statusUpper === 'CANCEL' ||
      statusUpper.includes('FAILED') ||
      statusUpper.includes('RISK')
    ) {
      return '#ff4444'; // Red
    }
    return '#fff'; // Default white
  };

  const getPromoStatusColor = (status: string) => {
    const statusUpper = status.toUpperCase();
    if (statusUpper === 'APPROVE' || statusUpper === 'APPROVED') {
      return '#4caf50'; // Green
    }
    if (
      statusUpper === 'CANCELLED' ||
      statusUpper === 'CANCEL' ||
      statusUpper === 'DECLINE' ||
      statusUpper === 'DECLINED' ||
      statusUpper.includes('RISK')
    ) {
      return '#ff4444'; // Red
    }
    return '#fff'; // Default white
  };

  const getTotalAmountLabel = () => {
    switch (activeTab) {
      case 'deposit':
        return t('transaction-record.total-deposit-amount');
      case 'withdrawal':
        return t('transaction-record.total-withdrawal-amount');
      case 'promo':
        return t('transaction-record.total-promo-amount');
      default:
        return t('transaction-record.total-amount');
    }
  };

  const totalAmount = React.useMemo(() => {
    const recordsToProcess = allRecordsQuery.data || [];
    return recordsToProcess.reduce((acc, record) => {
      const statusUpper = record.status?.toUpperCase() || '';

      // Check if record is successful based on active tab
      let isSuccessful = false;

      if (activeTab === 'withdrawal') {
        // For withdrawals, count PAID or APPROVE status
        isSuccessful =
          statusUpper === 'APPROVE' ||
          statusUpper === 'APPROVED' ||
          statusUpper.includes('PAID');
      } else {
        // For deposits and promo, count only APPROVE status
        isSuccessful = statusUpper === 'APPROVE' || statusUpper === 'APPROVED';
      }

      if (isSuccessful) {
        if ('amount' in record && typeof record.amount === 'number') {
          return acc + record.amount;
        } else if ('reward' in record && typeof record.reward === 'number') {
          return acc + record.reward;
        }
      }
      return acc;
    }, 0);
  }, [allRecordsQuery.data, activeTab]);

  // Render deposit record card
  const renderDepositRecord = (record: DepositRecord) => (
    <View key={record.orderid} style={styles.recordCard}>
      {/* Summary */}
      <TouchableOpacity
        style={styles.recordSummary}
        onPress={() => toggleExpanded(record.orderid)}
      >
        <View style={styles.recordSummaryContent}>
          <View style={styles.recordLeft}>
            <Text style={styles.recordTime}>
              {convertToPakistanTime(record.request_time, 'MM-DD HH:MM:ss')}
            </Text>
            <Text style={styles.recordTypeLabel}>
              Type: <Text style={styles.recordTypeValue}>Deposit</Text>
            </Text>
          </View>
          <View style={styles.recordRight}>
            <View style={styles.amountContainer}>
              <Image
                source={require('../../assets/drawer/wallet-coin.png')}
                style={styles.coinIcon}
              />
              <Text style={styles.recordAmount}>
                {record.amount.toLocaleString()} PKR
              </Text>
            </View>
            <Text style={styles.recordStatusLabel}>
              Status:{' '}
              <Text
                style={[
                  styles.recordStatusValue,
                  { color: getDepositStatusColor(record.status) },
                ]}
              >
                {formatStatus(record.status)}
              </Text>
            </Text>
          </View>
        </View>
        <Text style={styles.expandIcon}>
          <Feather
            name={
              expandedItems.has(record.orderid) ? 'chevron-down' : 'chevron-up'
            }
            size={20}
            color="white"
          />
        </Text>
      </TouchableOpacity>

      {/* Details */}
      {expandedItems.has(record.orderid) && (
        <View style={styles.recordDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Channel:</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>
                {record.platform_id || 'N/A'}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>
                {record.amount.toLocaleString()} PKR
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Request Time:</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>
                {convertToPakistanTime(record.request_time, 'MM-DD HH:MM:ss')}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID:</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{record.orderid}</Text>
              <TouchableOpacity
                style={[
                  styles.copyButton,
                  { backgroundColor: theme['color-success-500'] },
                ]}
                onPress={() => handleCopy(record.orderid)}
              >
                <Text style={styles.copyIcon}>📋</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons for Deposit */}
          {(record.status?.toLowerCase() === 'request' ||
            record.status?.toLowerCase() === 'pending') && (
            <View style={styles.actionButtonsContainer}>
              <Button
                appearance="filled"
                status="danger"
                style={styles.actionButton}
                size="small"
                disabled={cancelDepositMutation.isPending}
                onPress={() => handleCancelDeposit(record.orderid)}
              >
                {cancelDepositMutation.isPending
                  ? 'Canceling...'
                  : 'Cancel Payment'}
              </Button>
              <Button
                appearance="filled"
                status="basic"
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: '#4caf50',
                    borderColor: '#4caf50',
                    minWidth: 120,
                    height: 30,
                  },
                ]}
                size="small"
                onPress={handleContinuePayment}
              >
                <Text style={{ color: '#fff' }}>Continue Payment</Text>
              </Button>
            </View>
          )}
        </View>
      )}
    </View>
  );

  // Render withdrawal record card
  const renderWithdrawalRecord = (record: WithdrawRecord) => (
    <View key={record.orderid} style={styles.recordCard}>
      {/* Summary */}
      <TouchableOpacity
        style={styles.recordSummary}
        onPress={() => toggleExpanded(record.orderid)}
      >
        <View style={styles.recordSummaryContent}>
          <View style={styles.recordLeft}>
            <Text style={styles.recordTime}>
              {convertToPakistanTime(record.request_time, 'MM-DD HH:MM:ss')}
            </Text>
            <Text style={styles.recordTypeLabel}>
              Type: <Text style={styles.recordTypeValue}>Withdrawal</Text>
            </Text>
          </View>
          <View style={styles.recordRight}>
            <View style={styles.amountContainer}>
              <Image
                source={require('../../assets/drawer/wallet-coin.png')}
                style={styles.coinIcon}
              />
              <Text style={styles.recordAmount}>
                {record.amount.toLocaleString()} PKR
              </Text>
            </View>
            <Text style={styles.recordStatusLabel}>
              Status:{' '}
              <Text
                style={[
                  styles.recordStatusValue,
                  { color: getWithdrawalStatusColor(record.status) },
                ]}
              >
                {formatStatus(record.status)}
              </Text>
            </Text>
          </View>
        </View>
        <Text style={styles.expandIcon}>
          <Feather
            name={
              expandedItems.has(record.orderid) ? 'chevron-down' : 'chevron-up'
            }
            size={20}
            color="white"
          />
        </Text>
      </TouchableOpacity>

      {/* Details */}
      {expandedItems.has(record.orderid) && (
        <View style={styles.recordDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>
                {record.amount.toLocaleString()} PKR
              </Text>
            </View>
          </View>
          {record.transfer_amount && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transfer Amount:</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>
                  {record.transfer_amount.toLocaleString()} PKR
                </Text>
              </View>
            </View>
          )}
          {record.payment_method && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method:</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{record.payment_method}</Text>
              </View>
            </View>
          )}
          {record.bank_name && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bank Name:</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{record.bank_name}</Text>
              </View>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Request Time:</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>
                {convertToPakistanTime(
                  record.request_time,
                  'YYYY-DD-MM HH:MM:ss',
                )}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID:</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{record.orderid}</Text>
              <TouchableOpacity
                style={[
                  styles.copyButton,
                  { backgroundColor: theme['color-success-500'] },
                ]}
                onPress={() => handleCopy(record.orderid)}
              >
                <Text style={styles.copyIcon}>📋</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  // Render bonus record card
  const renderBonusRecord = (record: BonusRecord) => (
    <View key={record.id || record.guid} style={styles.recordCard}>
      {/* Summary */}
      <TouchableOpacity
        style={styles.recordSummary}
        onPress={() => toggleExpanded(record.id || record.guid || '')}
      >
        <View style={styles.recordSummaryContent}>
          <View style={styles.recordLeft}>
            <Text style={styles.recordTime}>
              {convertToPakistanTime(record.review_time || record.request_time, 'MM-DD HH:MM:ss')}
            </Text>
            <Text style={styles.recordTypeLabel}>
              Type: <Text style={styles.recordTypeValue}>Bonus</Text>
            </Text>
          </View>
          <View style={styles.recordRight}>
            <View style={styles.amountContainer}>
              <Image
                source={require('../../assets/drawer/wallet-coin.png')}
                style={styles.coinIcon}
              />
              <Text style={styles.recordAmount}>
                {record.reward.toLocaleString()} PKR
              </Text>
            </View>
            <Text style={styles.recordStatusLabel}>
              Status:{' '}
              <Text
                style={[
                  styles.recordStatusValue,
                  { color: getPromoStatusColor(record.status) },
                ]}
              >
                {formatStatus(record.status)}
              </Text>
            </Text>
          </View>
        </View>
        <Text style={styles.expandIcon}>
          <Feather
            name={
              expandedItems.has(record.id || record.guid || '')
                ? 'chevron-down'
                : 'chevron-up'
            }
            size={20}
            color="white"
          />
        </Text>
      </TouchableOpacity>

      {/* Details */}
      {expandedItems.has(record.id || record.guid || '') && (
        <View style={styles.recordDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bonus Details:</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{record.remarks || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>
                {record.reward.toLocaleString()} PKR
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Review Time:</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>
                {convertToPakistanTime(
                  record.review_time || record.request_time,
                  'MM-DD HH:MM:ss'
                )}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Record ID:</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{record.id || record.guid}</Text>
              <TouchableOpacity
                style={[
                  styles.copyButton,
                  { backgroundColor: theme['color-success-500'] },
                ]}
                onPress={() => handleCopy(record.id || record.guid || '')}
              >
                <Text style={styles.copyIcon}>📋</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#171717' }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={
              (activeTab === 'deposit' &&
                depositQuery.isFetching &&
                !depositQuery.isLoading) ||
              (activeTab === 'withdrawal' &&
                withdrawalQuery.isFetching &&
                !withdrawalQuery.isLoading) ||
              (activeTab === 'promo' &&
                bonusQuery.isFetching &&
                !bonusQuery.isLoading)
            }
            onRefresh={handleRefresh}
            tintColor={theme['color-success-500']}
            colors={[theme['color-success-500']]}
          />
        }
      >
        {/* Tab Container */}
        <View style={styles.tabContainer}>
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
        </View>

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

        {/* Total Amount Display */}
        <View style={styles.totalAmountContainer}>
          <Text
            style={[
              styles.totalAmountLabel,
              { color: theme['color-success-500'] },
            ]}
          >
            {getTotalAmountLabel()}
          </Text>
          <Text style={styles.totalAmountValue}>
            {totalAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>

        {/* Deposit Tab Content */}
        {activeTab === 'deposit' && (
          <>
            {/* Loading State for Deposits */}
            {depositQuery.isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color={theme['color-success-500']}
                />
                <Text style={styles.loadingText}>
                  {t('transaction-record.loading-deposit-records')}
                </Text>
              </View>
            )}

            {/* Error State for Deposits */}
            {depositQuery.error && !depositQuery.isLoading && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {t('transaction-record.failed-to-load-deposit-records')}
                </Text>
                <Button
                  appearance="outline"
                  status="basic"
                  size="small"
                  onPress={() => depositQuery.refetch()}
                  style={styles.retryButton}
                >
                  {t('transaction-record.retry')}
                </Button>
              </View>
            )}

            {/* Deposit Records List */}
            {!depositQuery.isLoading && !depositQuery.error && (
              <View style={styles.recordsList}>
                {depositQuery.records.length === 0 ? (
                  <View style={styles.noRecordsContainer}>
                    <Text style={styles.noRecordsText}>
                      {t('transaction-record.no-deposit-records-found')}
                    </Text>
                  </View>
                ) : (
                  <View style={{ gap: 12, flexDirection: 'column' }}>
                    {depositQuery.records.map(record =>
                      renderDepositRecord(record),
                    )}
                  </View>
                )}
              </View>
            )}
          </>
        )}

        {/* Withdrawal Tab Content */}
        {activeTab === 'withdrawal' && (
          <>
            {/* Loading State for Withdrawals */}
            {withdrawalQuery.isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color={theme['color-success-500']}
                />
                <Text style={styles.loadingText}>
                  {t('transaction-record.loading-withdrawal-records')}
                </Text>
              </View>
            )}

            {/* Error State for Withdrawals */}
            {withdrawalQuery.error && !withdrawalQuery.isLoading && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {t('transaction-record.failed-to-load-withdrawal-records')}
                </Text>
                <Button
                  appearance="outline"
                  status="basic"
                  size="small"
                  onPress={() => withdrawalQuery.refetch()}
                  style={styles.retryButton}
                >
                  {t('transaction-record.retry')}
                </Button>
              </View>
            )}

            {/* Withdrawal Records List */}
            {!withdrawalQuery.isLoading && !withdrawalQuery.error && (
              <View style={styles.recordsList}>
                {withdrawalQuery.records.length === 0 ? (
                  <View style={styles.noRecordsContainer}>
                    <Text style={styles.noRecordsText}>
                      {t('transaction-record.no-withdrawal-records-found')}
                    </Text>
                  </View>
                ) : (
                  withdrawalQuery.records.map(record =>
                    renderWithdrawalRecord(record),
                  )
                )}
              </View>
            )}
          </>
        )}

        {/* Bonus Tab Content */}
        {activeTab === 'promo' && (
          <>
            {/* Loading State for Bonus */}
            {bonusQuery.isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color={theme['color-success-500']}
                />
                <Text style={styles.loadingText}>
                  {t('transaction-record.loading-bonus-records')}
                </Text>
              </View>
            )}

            {/* Error State for Bonus */}
            {bonusQuery.error && !bonusQuery.isLoading && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {t('transaction-record.failed-to-load-bonus-records')}
                </Text>
                <Button
                  appearance="outline"
                  status="basic"
                  size="small"
                  onPress={() => bonusQuery.refetch()}
                  style={styles.retryButton}
                >
                  {t('transaction-record.retry')}
                </Button>
              </View>
            )}

            {/* Bonus Records List */}
            {!bonusQuery.isLoading && !bonusQuery.error && (
              <View style={styles.recordsList}>
                {bonusQuery.records.length === 0 ? (
                  <View style={styles.noRecordsContainer}>
                    <Text style={styles.noRecordsText}>
                      {t('transaction-record.no-bonus-records-found')}
                    </Text>
                  </View>
                ) : (
                  bonusQuery.records.map(record => renderBonusRecord(record))
                )}
              </View>
            )}
          </>
        )}
        {activeQuery.records.length > 0 &&
          activeQuery.pagination.totalPage > 1 && (
            <View style={{ marginBottom: 30, marginTop: 20 }}>
              <CustomPagination
                totalItems={activeQuery.pagination.totalItems}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={page => {
                  setCurrentPage(page);
                }}
              />
            </View>
          )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#fff',
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
  },
  recordStatusValue: {
    color: '#fff',
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
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  actionButton: {
    minWidth: 120,
    height: 30,
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
});

export default TransactionRecordScreen;
