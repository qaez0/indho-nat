import { View, StyleSheet } from 'react-native';
import { Text as UIText, useTheme } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

interface BalanceWithdrawableProps {
  cashBalance?: string;
  withdrawableBalance?: string;
}

const BalanceWithdrawable = ({
  cashBalance,
  withdrawableBalance,
}: BalanceWithdrawableProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <View
      style={[
        { backgroundColor: theme['background-basic-color-2'] },
        styles.detailsContainer,
      ]}
    >
      <View style={styles.detailsBox}>
        {cashBalance ? (
          <UIText style={styles.balance}>{cashBalance}</UIText>
        ) : (
          <View style={styles.skeleton}>
            <View style={styles.skeletonText} />
          </View>
        )}
        <UIText style={styles.balanceLabel}>
          {t('deposit-withdraw.balance-withdrawable.cash-balance')}
        </UIText>
      </View>
      <View style={styles.detailsDivider} />
      <View style={styles.detailsBox}>
        {withdrawableBalance ? (
          <UIText style={styles.balance}>{withdrawableBalance}</UIText>
        ) : (
          <View style={styles.skeleton}>
            <View style={styles.skeletonText} />
          </View>
        )}
        <UIText style={styles.balanceLabel}>
          {t('deposit-withdraw.balance-withdrawable.withdrawable')}
        </UIText>
      </View>
    </View>
  );
};

export default BalanceWithdrawable;

const styles = StyleSheet.create({
  detailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  detailsBox: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  detailsDivider: {
    width: 1,
    height: 48,
    backgroundColor: '#ffffff',
    opacity: 0.1,
  },
  balance: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  balanceLabel: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 12,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  skeleton: {
    width: 100,
    height: 30,
  },
  skeletonText: {
    width: 100,
    height: 30,
    backgroundColor: '#444444',
    borderRadius: 4,
  },
});
