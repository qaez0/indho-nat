import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import type { IRebateSettingItem } from '../../../types/invite';
import { InviteLinkSection } from './InviteLinkSection';

interface AboutTabProps {
  rebateSettingResult: any;
  inviteLink: string;
  copied: boolean;
  handleCopyLink: () => void;
}

export const AboutTab: React.FC<AboutTabProps> = ({
  rebateSettingResult,
  inviteLink,
  copied,
  handleCopyLink,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const rebateSettingData =
    (rebateSettingResult.data?.data?.data as IRebateSettingItem[]) || [];
  const isLoadingRebateSetting = rebateSettingResult.isLoading;

  // Debug logs to see what's happening
  console.log('=== AboutTab Debug ===');
  console.log('rebateSettingResult:', JSON.stringify(rebateSettingResult, null, 2));
  console.log('rebateSettingData:', rebateSettingData);
  console.log('rebateSettingData.length:', rebateSettingData.length);
  console.log('isLoadingRebateSetting:', isLoadingRebateSetting);
  console.log('rebateSettingResult.error:', rebateSettingResult.error);
  console.log('rebateSettingResult.isSuccess:', rebateSettingResult.isSuccess);
  console.log('rebateSettingResult.isError:', rebateSettingResult.isError);
  console.log('rebateSettingResult.status:', rebateSettingResult.status);

  return (
    <ScrollView
      style={styles.tabContent}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled>
      <Image
        source={require('../../../assets/common/invite/IRabout.png')}
        style={styles.bannerImage as any}
        resizeMode="contain"
      />

      <View style={styles.rebateTableCard}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text
              style={[
                styles.tableHeaderText,
                { color: theme['color-success-500'] },
              ]}>
              {t('invite.level')}
            </Text>
            <Text
              style={[
                styles.tableHeaderText,
                { color: theme['color-success-500'] },
              ]}>
              {t('invite.bet-amount')}
            </Text>
            <Text
              style={[
                styles.tableHeaderText,
                { color: theme['color-success-500'] },
              ]}>
              {t('invite.active-member')}
            </Text>
            <Text
              style={[
                styles.tableHeaderText,
                { color: theme['color-success-500'] },
              ]}>
            {t('invite.reward-rate')}
            </Text>
          </View>
          {isLoadingRebateSetting ? (
            <View style={styles.loaderRow}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.tableCellText}>{t('common-terms.loading')}</Text>
            </View>
          ) : rebateSettingData.length === 0 ? (
            <View style={styles.loaderRow}>
              <Text style={styles.tableCellText}>{t('common-terms.no-data-available')}</Text>
            </View>
          ) : (
            rebateSettingData
              .sort((a, b) => b.level - a.level) // Sort by level descending (13 to 1)
              .map(item => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={styles.tableCellText}>LVL{item.level}</Text>
                  <Text style={styles.tableCellText}>
                    {item.bet_amount.toLocaleString()}
                  </Text>
                  <Text style={styles.tableCellText}>{item.active_member}</Text>
                  <Text style={styles.tableCellText}>{item.reward}%</Text>
                </View>
              ))
          )}
        </View>
      </View>

      <View style={styles.termsCard}>
        <Text
          style={[styles.termsTitle, { color: theme['color-success-500'] }]}>
          {t('invite.daily-invite-reward-tab.about-tab.terms-title')}
        </Text>
        {[
           t('invite.daily-invite-reward-tab.about-tab.terms-1'),
           t('invite.daily-invite-reward-tab.about-tab.terms-2'),
           t('invite.daily-invite-reward-tab.about-tab.terms-3'),
           t('invite.daily-invite-reward-tab.about-tab.terms-4'),
           t('invite.daily-invite-reward-tab.about-tab.terms-5'),
        
        ].map((term, index) => (
          <Text key={index} style={styles.termText}>
            {index + 1}. {term}
          </Text>
        ))}
      </View>

      <InviteLinkSection
        inviteLink={inviteLink}
        copied={copied}
        onCopy={handleCopyLink}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  rebateTableCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1a1a1a',
    marginBottom: 16,
    overflow: 'hidden',
  },
  tableContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#666',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#272727',
    paddingVertical: 12,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    color: '#F3B867',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
    minHeight: 40,
  },
  loaderRow: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  tableCellText: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  termsCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  termsTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    color: '#F3B867',
  },
  termText: {
    color: '#ccc',
    fontSize: 10,
    lineHeight: 15,
    marginBottom: 8,
  },
});
