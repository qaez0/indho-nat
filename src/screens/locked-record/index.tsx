import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Text, useTheme, Select, SelectItem } from '@ui-kitten/components';
import Feather from '@react-native-vector-icons/feather';
import {
  useLockRecords,
  useLockRecordState,
  filterLockRecords,
  type LockType,
  type StatusFilter,
} from './useLockRecords';
import type { LockRecord } from '../../types/record';
import { useTranslation } from 'react-i18next';



const LockedDetailsScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    activeTab,
    setActiveTab,
    selectedStatus,
    setSelectedStatus,
    selectedDays,
    expandedItems,
    toggleExpanded,
    resetPagination,
  } = useLockRecordState();

  const {
    records,
    isLoading,
    error,
    refetch,
  } = useLockRecords(selectedDays, 1, 1000); // Get large page size for client-side filtering

  const tabOptions = [
    { label: t('locked-details.deposit'), value: 'deposit' as LockType },
    { label: t('locked-details.promo'), value: 'promo' as LockType },
  ];

  const statusOptions = [
    { label: t('locked-details.status-filter.all'), value: 'all' as StatusFilter },
    { label: t('locked-details.status-filter.incomplete'), value: 'incomplete' as StatusFilter },
    { label: t('locked-details.status-filter.completed'), value: 'completed' as StatusFilter },
  ];

  const filteredRecords = filterLockRecords(records, activeTab, selectedStatus);

  useEffect(() => {
    refetch();
  }, [activeTab, refetch]);

  const formatTimeMinusThreeHours = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return dateString.replace?.('T', ' ') ?? dateString;
    }
    date.setHours(date.getHours() - 3);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const renderStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'UNLOCK':
        return { text: t('locked-details.status-filter.completed'), color: '#31bc69' };
      case 'LOCKED':
        return { text: t('locked-details.status-filter.incomplete'), color: '#f14a61' };
      default:
        return { text: status || 'N/A', color: 'rgba(255, 255, 255, 0.8)' };
    }
  };



  const renderLockDetails = (record: LockRecord) => {
    let details: { label: string; value: React.ReactNode }[] = [];

    if (activeTab === 'deposit') {
      details = [
        {
          label: 'Deposit Amount',
          value: (
            <View style={styles.amountWithCoin}>
              <Image 
                source={require('../../assets/drawer/wallet-coin.png')}
                style={styles.coinIcon}
              />
              <Text style={styles.detailAmountValue}>
                {record.amount?.toLocaleString() || 0} PKR
              </Text>
            </View>
          ),
        },
        {
          label: 'Locked Amount',
          value: (
            <View style={styles.amountWithCoin}>
              <Image 
                source={require('../../assets/drawer/wallet-coin.png')}
                style={styles.coinIcon}
              />
              <Text style={styles.detailAmountValue}>
                {record.target_amount?.toLocaleString() || 0} PKR
              </Text>
            </View>
          ),
        },
        { label: 'Date & Time', value: formatTimeMinusThreeHours(record.lock_time) },
      ];
    } else if (activeTab === 'promo') {
      details = [
        {
          label: 'Bonus Amount',
          value: (
            <View style={styles.amountWithCoin}>
              <Image 
                source={require('../../assets/drawer/wallet-coin.png')}
                style={styles.coinIcon}
              />
              <Text style={styles.detailAmountValue}>
                {record.amount?.toLocaleString() || 0} PKR
              </Text>
            </View>
          ),
        },
        {
          label: 'Locked Amount',
          value: (
            <View style={styles.amountWithCoin}>
              <Image 
                source={require('../../assets/drawer/wallet-coin.png')}
                style={styles.coinIcon}
              />
              <Text style={styles.detailAmountValue}>
                {record.target_amount?.toLocaleString() || 0} PKR
              </Text>
            </View>
          ),
        },
        { label: 'Date & Time', value:  formatTimeMinusThreeHours(record.lock_time) },
      ];
    }

    return details;
  };



  return (
    <View style={[styles.container, { backgroundColor: theme['bg-primary'] }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Tab Container */}
        <View style={styles.tabContainer}>
          {tabOptions.map((tab) => (
            <TouchableOpacity
              key={tab.value}
              style={[
                styles.tabButton,
                {
                  backgroundColor: activeTab === tab.value 
                    ? theme['color-success-500'] 
                    : 'transparent',
                  borderColor: activeTab === tab.value 
                    ? 'transparent' 
                    : '#fff',
                }
              ]}
              onPress={() => {
                setActiveTab(tab.value);
                resetPagination();
              }}
            >
              <Text style={[
                styles.tabButtonText,
                {
                  color: activeTab === tab.value ? '#23272f' : '#fff',
                  fontWeight: activeTab === tab.value ? 'bold' : 'normal',
                }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.statusLabel}>{t('locked-details.status-label')}</Text>
          
          <Select
            style={styles.selectContainer}
            placeholder={t('locked-details.status-label')}
            value={statusOptions.find(opt => opt.value === selectedStatus)?.label || t('locked-details.status-filter.all')}
            onSelect={(index) => {
              const selectedIndex = Array.isArray(index) ? index[0] : index;
              const statusValue = statusOptions[selectedIndex.row]?.value;
              if (statusValue) {
                setSelectedStatus(statusValue);
              }
            }}
          >
            {statusOptions.map((option) => (
              <SelectItem key={option.value} title={option.label} />
            ))}
          </Select>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme['color-success-500']} />
            <Text style={styles.loadingText}>Loading records...</Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Error loading records: {error.message}
            </Text>
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: theme['color-success-500'] }]}
              onPress={() => refetch()}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Records List */}
        {!isLoading && !error && (
          <View style={styles.recordsList}>
            {filteredRecords.length === 0 ? (
              <View style={styles.noRecordsContainer}>
                <Text style={styles.noRecordsText}>{t('locked-details.no-records-found-simple')}</Text>
              </View>
            ) : (
              filteredRecords.map((record) => {
              const statusInfo = renderStatusText(record.status);
              
              return (
                <View key={record.guid} style={styles.recordCard}>
                  {/* Summary */}
                  <TouchableOpacity
                    style={styles.recordSummary}
                    onPress={() => toggleExpanded(record.guid)}
                  >
                    <View style={styles.recordSummaryContent}>
                      {/* First Line: Amount (left) and Status (2/3 position) */}
                      <View style={styles.firstLine}>
                        {/* Amount with coin icon - Left Section */}
                        <View style={styles.amountContainer}>
                          <Image 
                            source={require('../../assets/drawer/wallet-coin.png')}
                            style={styles.coinIcon}
                          />
                          <Text style={styles.recordAmount}>
                            {record.amount?.toLocaleString() || 0}
                          </Text>
                        </View>
                        
                        {/* Status - 2/3 Position */}
                        <View style={styles.statusContainer}>
                          <Text style={styles.statusLabelText}>{t('locked-details.status-label')}</Text>
                          <Text style={[styles.statusValue, { color: statusInfo.color }]}>
                            {statusInfo.text}
                          </Text>
                        </View>
                      </View>
                      
                      {/* Second Line: Order Number */}
                      <View style={styles.secondLine}>
                        <Text style={styles.orderNumberLabel}>
                          {t('locked-details.order-number-label')}{' '}
                          <Text style={styles.orderNumberValue}>{record.guid}</Text>
                        </Text>
                      </View>
                    </View>
                    <Feather 
                      name={expandedItems.has(record.guid) ? 'chevron-down' : 'chevron-up'} 
                      size={20} 
                      color="white" 
                      style={styles.expandIcon}
                    />
                  </TouchableOpacity>

                  {/* Details */}
                  {expandedItems.has(record.guid) && (
                    <View style={styles.recordDetails}>
                      {renderLockDetails(record).map((detail, index) => (
                        <View key={index} style={styles.detailRow}>
                          <Text style={styles.detailLabel}>{detail.label}:</Text>
                          <View style={styles.detailValueContainer}>
                            {typeof detail.value === 'string' ? (
                              <Text style={styles.detailValue}>{detail.value}</Text>
                            ) : (
                              detail.value
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
              })
            )}
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
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  statusLabel: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  },
  selectContainer: {
    flex: 1,
    backgroundColor: 'transparent',
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
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#393939',
  },
  recordSummaryContent: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
  },
  firstLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinIcon: {
    width: 12,
    height: 12,
  },
  recordAmount: {
    color: '#d3d3d3',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '400',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: '66.67%',
    transform: [{ translateX: -50 }],
  },
  statusLabelText: {
    color: 'rgba(255, 255, 255, 0.38)',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '400',
    marginRight: 4,
  },
  statusValue: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '400',
  },
  secondLine: {
    width: '100%',
  },
  orderNumberLabel: {
    color: 'rgba(255, 255, 255, 0.38)',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '400',
  },
  orderNumberValue: {
    color: '#d3d3d3',
  },
  expandIcon: {
    color: '#a7a7a7',
    fontSize: 20,
    marginLeft: 16,
    marginTop: 4,
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
    color: 'rgba(255, 255, 255, 0.38)',
    fontSize: 14,
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
    color: '#d3d3d3',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '400',
    flex: 1,
  },
  amountWithCoin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailAmountValue: {
    color: '#d3d3d3',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '400',
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
    padding: 20,
  },
  errorText: {
    color: '#f14a61',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#23272f',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LockedDetailsScreen;
