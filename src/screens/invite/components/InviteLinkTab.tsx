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
import { imageHandler } from '../../../utils/image-url';
import { InviteLinkSection } from './InviteLinkSection';

interface InviteLinkTabProps {
  rebateReportTotalResult: any;
  inviteLink: string;
  copied: boolean;
  handleCopyLink: () => void;
}

export const InviteLinkTab: React.FC<InviteLinkTabProps> = ({
  rebateReportTotalResult,
  inviteLink,
  copied,
  handleCopyLink,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const totalRewards =
    rebateReportTotalResult.data?.data?.total_reward_amount ?? 0;

  return (
    <ScrollView
      style={styles.tabContent}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled>
      <Image
        source={{
          uri: imageHandler(
            '/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/invite-bonus-mb3/public',
          ),
        }}
        style={styles.bannerImage as any}
        resizeMode="contain"
      />

      <InviteLinkSection
        inviteLink={inviteLink}
        copied={copied}
        onCopy={handleCopyLink}
      />

      <View style={styles.howToCard}>
        <Text
          style={[styles.howToTitle, { color: theme['color-success-500'] }]}>
         {t('invite.daily-invite-reward-tab.invite-link-tab.how-to-start-earning')}
        </Text>

        {[
          { step: 'STEP 1', text: t('invite.daily-invite-reward-tab.invite-link-tab.share-invite-link-with-friend') },
          {
            step: 'STEP 2',
            text: t('invite.daily-invite-reward-tab.invite-link-tab.encourage-friends-sign-up-and-deposit'),
          },
          { step: 'STEP 3', text: t('invite.daily-invite-reward-tab.invite-link-tab.invites-play-earn-rewards') },
        ].map((item, index) => (
          <View key={index}>
            <View style={styles.stepContainer}>
              <Text style={styles.stepLabel}>
                <Text style={styles.stepWord}>{t('common-terms.step')}</Text>
                <Text style={styles.stepNumberLarge}> {index + 1}</Text>
              </Text>
              <Text style={styles.stepDescription}>{item.text}</Text>
            </View>
            {index < 2 && <View style={styles.stepSeparator} />}
          </View>
        ))}

        <View style={styles.stepSeparator} />
        <Text
          style={[
            styles.moreInvitesText,
            { color: theme['color-success-500'],marginBottom: 15  },
          ]}>
{t('invite.daily-invite-reward-tab.invite-link-tab.more-invites-higher-rewards')}
        </Text>
        <View style={styles.stepSeparator} /> 
      </View>
     

      <View style={styles.totalRewardsCard}>
        <Text style={styles.totalRewardsLabel}>{t('invite.daily-invite-reward-tab.invite-link-tab.total-rewards-received')}</Text>
        {rebateReportTotalResult.isLoading ? (
          <ActivityIndicator color={theme['color-success-500']} />
        ) : (
          <Text
            style={[
              styles.totalRewardsAmount,
              { color: theme['color-success-500'] },
            ]}>
            {totalRewards}
          </Text>
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
  bannerImage: {
    width: '100%',
    height: 400,
    borderRadius: 8,
    marginBottom: 16,
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
    textAlign: 'center',
  },
  stepContainer: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  stepLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 12,
  },
  stepWord: {
    fontSize: 12,
  },
  stepNumberLarge: {
    fontSize: 18,
  },
  stepDescription: {
    color: 'white',
    fontSize: 12,
    flex: 1,
  },
  stepSeparator: {
    height: 1,
    backgroundColor: '#666',
    marginHorizontal: '10%',
    marginVertical: 8,
  },
  moreInvitesText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  totalRewardsCard: {
    backgroundColor: '#272727',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  totalRewardsLabel: {
    color: '#ccc',
    fontSize: 12,
  },
  totalRewardsAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
