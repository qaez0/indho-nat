import React, { Fragment, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Modal, Text } from '@ui-kitten/components';
import type { DialogProps } from '.';
import type { IInviteRecord, ISpinRecord } from '../../../../types/envelope';
import { useTranslation } from 'react-i18next';

const formatDate = (dateString?: string) => {
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

const SpinRecordDialog = ({
  open,
  onClose,
  spinRecord,
  inviteRecord,
}: DialogProps & {
  spinRecord: ISpinRecord[];
  inviteRecord: IInviteRecord[];
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'spin' | 'invitation'>(
    'invitation',
  );
  const item = activeTab === 'spin' ? spinRecord : inviteRecord;
  const handleSwitchTab = (tab: 'spin' | 'invitation') => {
    setActiveTab(tab);
  };

  return (
    <Modal
      visible={open}
      backdropStyle={styles.backdrop}
      onBackdropPress={onClose}
      style={{ width: '100%', padding: 12 }}
      animationType="fade"
    >
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.tabsRow}>
            <Text
              onPress={() => handleSwitchTab('invitation')}
              style={[
                styles.tabText,
                activeTab !== 'invitation' && styles.tabInactive,
              ]}
            >
              {t('lucky-spin.spin-record.invitation')}
            </Text>
            <Text
              onPress={() => handleSwitchTab('spin')}
              style={[
                styles.tabText,
                activeTab !== 'spin' && styles.tabInactive,
              ]}
            >
              {t('lucky-spin.spin-record.spin-record')}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: '#FFFFFF' }}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          {item.length > 0 ? (
            <Fragment>
              <View style={styles.headerCols}>
                <Text style={styles.headerColText}>
                  {t('lucky-spin.spin-record.date-time')}
                </Text>
                <Text style={styles.headerColText}>
                  {activeTab === 'spin'
                    ? t('lucky-spin.spin-record.amount')
                    : t('lucky-spin.spin-record.friends')}
                </Text>
              </View>
              <ScrollView>
                {item.map((row, index) => (
                  <SpinRecordItem
                    key={index}
                    column1={
                      activeTab === 'spin'
                        ? formatDate((row as ISpinRecord).spin_date)
                        : formatDate((row as IInviteRecord).invite_date)
                    }
                    column2={
                      activeTab === 'spin'
                        ? `PKR ${(row as ISpinRecord).reward}`
                        : (row as IInviteRecord).invitee
                    }
                    type={activeTab}
                  />
                ))}
              </ScrollView>
            </Fragment>
          ) : (
            <Text style={styles.noRecords}>
              {t('lucky-spin.spin-record.no-records')}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default SpinRecordDialog;

interface SpinRecordItemProps {
  column1: string;
  column2: string;
  type: 'spin' | 'invitation';
}
const SpinRecordItem = ({ column1, column2 }: SpinRecordItemProps) => {
  return (
    <View style={styles.rowItem}>
      <Text style={styles.rowText}>{column1}</Text>
      <Text style={styles.rowTextBold}>{column2}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.8)' },
  container: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#323631',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    flex: 1,
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  tabInactive: { opacity: 0.6 },
  body: {
    backgroundColor: 'rgba(0, 0, 0, .10)',
    minHeight: 224,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  headerCols: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerColText: { color: '#FFFFFF', fontSize: 12, opacity: 0.6 },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  rowText: { color: '#FFFFFF', fontSize: 12 },
  rowTextBold: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  noRecords: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    opacity: 0.8,
  },
});
