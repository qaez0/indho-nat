import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { InviteLinkSection } from './InviteLinkSection';
import { imageHandler } from '../../../utils/image-url';
import type { InviteBonusData, RewardTier } from '../../../types/invite';
import { useTranslation } from 'react-i18next';
import InvitePulsingIcon from './InvitePulsingIcon';



interface InviteEarnTabProps {
  inviteBonusResult: any;
  isAuthenticated: boolean;
  activeTimeFilter: string;
  setActiveTimeFilter: (filter: string) => void;
  inviteLink: string;
  copied: boolean;
  handleCopyLink: () => void;
}

const InfoBox = ({
  item,
  isLoading,
}: {
  item: {
    iconName: string;
    title: string;
    value: string | number;
    prefix?: string;
  };
  isLoading: boolean;
}) => (
  <View style={styles.infoBox}>
    <InvitePulsingIcon
      source={{ uri: imageHandler(`/images/common/invite/${item.iconName}.png`) }}
      style={styles.infoBoxIcon as any}
    />
    <Text style={styles.infoBoxTitle}>{item.title}</Text>
    {isLoading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={styles.infoBoxValue}>
        {item.prefix || ''}
        {item.value}
      </Text>
    )}
  </View>
);

const TimeFilterButtons = ({
  activeTimeFilter,
  setActiveTimeFilter,
  t,
}: {
  activeTimeFilter: string;
  setActiveTimeFilter: (filter: string) => void;
  t: any;
}) => {
  const theme = useTheme();
  const filters = [
    { key: 'today', label: t('invite.invite-earn-tab.today') },
    { key: 'yesterday', label: t('invite.invite-earn-tab.yesterday') },
    { key: 'all', label: t('invite.invite-earn-tab.all') }
  ];
  return (
    <View style={styles.timeFilterContainer}>
      {filters.map(filter => (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.timeFilterButton,
            {
              backgroundColor:
                activeTimeFilter === filter.key
                  ? theme['color-success-500']
                  : 'transparent',
              borderColor:
                activeTimeFilter === filter.key
                  ? theme['color-success-500']
                  : '#FFFFFF',
            },
          ]}
          onPress={() => setActiveTimeFilter(filter.key)}>
          <Text
            style={[
              styles.timeFilterText,
              {
                color: activeTimeFilter === filter.key ? '#000000' : '#FFFFFF',
              },
            ]}>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export const InviteEarnTab: React.FC<InviteEarnTabProps> = ({
  inviteBonusResult,
  isAuthenticated,
  activeTimeFilter,
  setActiveTimeFilter,
  inviteLink,
  copied,
  handleCopyLink,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const inviteBonusData = inviteBonusResult.data?.data as
    | InviteBonusData
    | undefined;
  const isLoadingInviteBonus = inviteBonusResult.isLoading;

  const infoBoxConfig = [
    {
      iconName: 'total-income',
      title: t('invite.invite-earn-tab.total-income'),
      dataKey: 'totalIncome',
      prefix: 'RS ',
    },
    {
      iconName: 'total-invites',
      title: t('invite.invite-earn-tab.total-invites'),
      dataKey: 'totalInvites',
    },
    {
      iconName: 'invitation-bonus',
      title: t('invite.invite-earn-tab.invitation-bonus'),
      dataKey: 'invitationBonus',
      prefix: 'RS ',
    },
    {
      iconName: 'deposit-bonus',
      title: t('invite.invite-earn-tab.deposit-bonus'),
      dataKey: 'depositBonus',
      prefix: 'RS ',
    },
    {
      iconName: 'bet-bonus',
      title: t('invite.invite-earn-tab.bet-bonus'),
      dataKey: 'betBonus',
      prefix: 'RS ',
    },
    {
      iconName: 'eligible-refers',
      title: t('invite.invite-earn-tab.eligible-refers'),
      dataKey: 'eligibleRefers',
    },
  ];

  const defaultInvitationRewards: RewardTier[] = [
    { minCount: 1, maxCount: 1, rewardAmount: 200 },
    { minCount: 2, maxCount: 50, rewardAmount: 250 },
    { minCount: 51, maxCount: 150, rewardAmount: 300 },
    { minCount: 151, maxCount: 1000, rewardAmount: 350 },
    { minCount: 1001, maxCount: 5000, rewardAmount: 400 },
  ];

  const formatPlayerRange = (min: number, max: number): string => {
    if (max >= 999999) return `${min}+`;
    if (min === max) return `${min}`;
    return `${min} - ${max}`;
  };

  return (
    <ScrollView
      style={styles.tabContent}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled>
      <InviteLinkSection
        inviteLink={inviteLink}
        copied={copied}
        onCopy={handleCopyLink}
      />

      {isAuthenticated && (
        <>
          <TimeFilterButtons
            activeTimeFilter={activeTimeFilter}
            setActiveTimeFilter={setActiveTimeFilter}
            t={t}
          />
          <View style={styles.infoBoxGrid}>
            {infoBoxConfig.map(item => {
              const rawValue =
                inviteBonusData?.[item.dataKey as keyof InviteBonusData] ?? 0;
              return (
                <View key={item.dataKey} style={styles.infoBoxWrapper}>
                  <InfoBox
                    item={{
                      ...item,
                      value:
                        typeof rawValue === 'number' ||
                        typeof rawValue === 'string'
                          ? rawValue
                          : '',
                    }}
                    isLoading={isLoadingInviteBonus}
                  />
                </View>
              );
            })}
          </View>
        </>
      )}

      <View style={styles.howToCard}>
        <Text style={styles.howToTitle}>{t('invite.invite-earn-tab.invite-friends-via-link')}</Text>
        <Text style={styles.howToSubtitle}>
          {t('invite.invite-earn-tab.how-to-get-your-invitation-bonus')}:
        </Text>

        {[
          t('invite.invite-earn-tab.copy-and-share-your-invite-link'),
          t('invite.invite-earn-tab.ask-your-friends-to-register-an-account-using-your-link'),
          t('invite.invite-earn-tab.make-sure-they-complete-a-deposit-after-registering'),
        ].map((step, index) => (
          <View key={index} style={styles.stepBox}>
            <Text
              style={[
                styles.stepNumber,
                { color: theme['color-success-500'] },
              ]}>
              {index + 1}.
            </Text>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      <View style={styles.rewardsTableCard}>
        <Text style={styles.tableTitle}>{t('invite.invite-earn-tab.invitation-rewards')}</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { color: theme['color-success-500'] }]}>
              {t('invite.invite-earn-tab.level')}
            </Text>
            <Text style={[styles.tableHeaderText, { color: theme['color-success-500'] }]}>
              {t('invite.invite-earn-tab.valid-players')}
            </Text>
            <Text style={[styles.tableHeaderText, { color: theme['color-success-500'] }]}>
              {t('invite.invite-earn-tab.invitation-rewards')}
            </Text>
          </View>
          {(isLoadingInviteBonus && isAuthenticated
            ? Array.from({ length: 5 })
            : inviteBonusData?.rewardTiers ?? defaultInvitationRewards
          ).map((tier, index) =>
            tier ? (
              <View
                key={(tier as RewardTier).minCount}
                style={styles.tableRow}>
                <View style={styles.tableCellCenter}>
                  {index < 3 && (
                    <InvitePulsingIcon
                      source={{
                        uri: imageHandler(`/images/common/invite/medals/${index + 1}.png`),
                      }}
                      style={styles.medalIcon as any}
                    />
                  )}
                  <Text style={styles.tableCellText}>LEVEL {index + 1}</Text>
                </View>
                <Text style={styles.tableCellTextcenter}>
                  {formatPlayerRange(
                    (tier as RewardTier).minCount,
                    (tier as RewardTier).maxCount,
                  )}
                </Text>
                <View style={styles.tableCellCenter}>
                <Text style={{width: '20%'}}/>
                  <Image
                    source={require('../../../assets/drawer/wallet-coin.png')}
                    style={styles.coinIcon as any}
                  />
                  <Text style={styles.tableCellText}>
                    {(tier as RewardTier).rewardAmount}
                  </Text>
                </View>
              </View>
            ) : (
              <View key={index} style={styles.tableRow}>
                <ActivityIndicator color="#fff" />
              </View>
            ),
          )}
        </View>
      </View>

      <View style={styles.depositCommissionCard}>
        <Text style={styles.depositCommissionTitle}>{t('invite.invite-earn-tab.deposit-commission.title') }</Text>
        <View
          style={[
            styles.commissionBox,
            { borderColor: theme['color-success-500'] },
          ]}>
          <Text style={styles.commissionDescription}>
          {t('invite.invite-earn-tab.deposit-commission.description')}
          </Text>
          <View
            style={[
              styles.commissionDivider,
              { backgroundColor: theme['color-success-500'] },
            ]}
          />
          <Text
            style={[
              styles.commissionPercentage,
              { color: theme['color-success-500'] },
            ]}>
            5%
          </Text>
        </View>

        <Text style={styles.noteTitle}>{t('invite.invite-earn-tab.deposit-commission.note-title')}:</Text>
        
        {/* Note 1 */}
        <View style={styles.noteItem}>
          <Text style={styles.noteNumber}>1.</Text>
          <Text style={styles.noteText}>{t('invite.invite-earn-tab.deposit-commission.note-1')}</Text>
        </View>

        {/* Note 2 */}
        <View style={styles.noteItem}>
          <Text style={styles.noteNumber}>2.</Text>
          <Text style={styles.noteText}>{t('invite.invite-earn-tab.deposit-commission.note-2')}</Text>
        </View>
        
        {/* Bulleted sub-items for Note 2 */}
        <View style={styles.bulletItem}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletText}>{t('invite.invite-earn-tab.deposit-commission.note-2-1')}</Text>
        </View>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletText}>{t('invite.invite-earn-tab.deposit-commission.note-2-2')}</Text>
        </View>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletText}>{t('invite.invite-earn-tab.deposit-commission.note-2-3')}</Text>
        </View>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletText}>{t('invite.invite-earn-tab.deposit-commission.note-2-4')}</Text>
        </View>

        {/* Note 3 */}
        <View style={styles.noteItem}>
          <Text style={styles.noteNumber}>3.</Text>
          <Text style={styles.noteText}>{t('invite.invite-earn-tab.deposit-commission.note-3')}</Text>
        </View>

        {/* Note 4 - Warning in red */}
        <View style={styles.noteItem}>
          <Text style={[styles.noteNumber, { color: '#FF0000' }]}>4.</Text>
          <Text style={[styles.noteText, { color: '#FF0000' }]}>{t('invite.invite-earn-tab.deposit-commission.note-4')}</Text>
        </View>

        {/* Note 5 */}
        <View style={styles.noteItem}>
          <Text style={styles.noteNumber}>5.</Text>
          <Text style={styles.noteText}>{t('invite.invite-earn-tab.deposit-commission.note-5')}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  timeFilterContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  timeFilterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  timeFilterText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  infoBoxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: 16,
  },
  infoBoxWrapper: {
    width: '50%',
    padding: 4,
  },
  infoBox: {
    backgroundColor: '#272727',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    height: 120,
    justifyContent: 'center',
  },
  infoBoxIcon: {
    width: 35,
    height: 35,
    marginBottom: 8,
  },
  infoBoxTitle: {
    color: '#A0A0A0',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
    textAlign: 'center',
  },
  infoBoxValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  howToCard: {
    backgroundColor: '#272727',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  howToTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  howToSubtitle: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 16,
  },
  stepBox: {
    backgroundColor: '#3A3A3A',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 12,
  },
  stepText: {
    color: '#E0E0E0',
    fontSize: 12,
    flex: 1,
  },
  rewardsTableCard: {
    backgroundColor: '#272727',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  tableTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
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
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 4,
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
  tableCellText: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
    textAlign: 'left',
    paddingHorizontal: 4,
  },
  tableCellTextcenter: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  tableCellCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingLeft: 8,
    gap: 1,
  },
  medalIcon: {
    width: 25,
    height: 25,
  },
  coinIcon: {
    width: 14,
    height: 14,
  },
  depositCommissionCard: {
    backgroundColor: '#272727',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  depositCommissionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  commissionBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  commissionDescription: {
    color: '#E0E0E0',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
    paddingRight: 8,
  },
  commissionDivider: {
    width: 1,
    height: 30,
  },
  commissionPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 0.3,
    textAlign: 'center',
    paddingLeft: 8,
  },
  noteTitle: {
    color: '#A0A0A0',
    fontSize: 12,
    marginBottom: 8,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteNumber: {
    color: '#E0E0E0',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 15,
  },
  noteText: {
    color: '#E0E0E0',
    fontSize: 12,
    flex: 1,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    marginLeft: 20,
  },
  bulletPoint: {
    color: '#E0E0E0',
    fontSize: 12,
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    color: '#E0E0E0',
    fontSize: 12,
    flex: 1,
  },
});
