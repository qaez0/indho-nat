import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';
import CustomInput, { ICustomInputProps } from './CustomInput';
import Coin from '../../../assets/dep-with/coin.svg';
import Arrow from '../../../assets/dep-with/arrow.svg';
import Reload from '../../../assets/dep-with/reload.svg';
import SpinningIcon from '../../../components/SpinningIcon';
import { useTranslation } from 'react-i18next';

interface IWithdrawalAmountProps {
  remainingTurnover?: number;
  refetch: () => void;
  isLoading: boolean;
  customInputProps: ICustomInputProps;
}

const WithdrawalAmount = ({
  remainingTurnover,
  refetch,
  isLoading,
  customInputProps,
}: IWithdrawalAmountProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <CustomInput {...customInputProps} currency="PKR"/>
      <View
        style={[
          styles.remainingTurnoverContainer,
          {
            backgroundColor: theme['background-basic-color-2'],
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Coin width={20} height={20} />
          <Text category="c2" style={{ color: 'white' }}>
            {t('deposit-withdraw.withdrawal-amount.remaining-turnover')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Arrow width={20} height={20} />
          <Text category="c2" style={{ color: 'white' }}>
            {remainingTurnover ?? '--'}
          </Text>
          <TouchableOpacity onPress={refetch}>
            <SpinningIcon isLoading={isLoading}>
              <Reload width={20} height={20} />
            </SpinningIcon>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WithdrawalAmount;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    borderRadius: 8,
  },
  remainingTurnoverContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 16,
    minHeight: 40,
  },
});
