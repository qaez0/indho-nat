import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';
import type { IPlayerCardInfo } from '../../../types/player';
import Feather from '@react-native-vector-icons/feather';
import { useWithdraw } from '../store';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootStackNav } from '../../../types/nav';
import { useTranslation } from 'react-i18next';
interface IAccount {
  bank_account_num: string;
  bank_account_name: string;
  bank_name: string;
  onClick: () => void;
  isSelected: boolean;
  ifsc?: string;
}

interface ChooseAccountProps {
  accounts: IPlayerCardInfo[];
}
const ChooseAccount = ({ accounts }: ChooseAccountProps) => {
  const { t } = useTranslation();
  const setSelectedCard = useWithdraw(state => state.setSelectedCard);
  const selectedCard = useWithdraw(state => state.selectedCard);
  const navigation = useNavigation<RootStackNav>();

  const addAccount = {
    bank_account_num: '0',
    bank_account_name: '',
    bank_name: t('common-terms.add-new-account'),
    card_type: 'EWALLET' as const,
    card_id: '',
    status: 0,
    bank_account_number: '',
    ifsc: '',
  };

  useEffect(() => {
    if (accounts.length > 0 && !selectedCard) {
      setSelectedCard(accounts[0]);
    }
  }, [accounts, selectedCard, setSelectedCard]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.accountContainer}>
        {[...accounts, addAccount].map((account, index) =>
          account.bank_account_num === '0' ? (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate('wallet-management')}
              style={styles.addAccountCard}
            >
              <Feather name="plus-circle" size={20} color="white" />
              <Text style={styles.addAccountText}>{t('common-terms.add-new-account')}</Text>
            </TouchableOpacity>
          ) : (
            <AccountCard
              key={index}
              {...account}
              {...(account.card_type === 'CRYPTO'
                ? { bank_name: 'USDT Address' }
                : {})}
              onClick={() => setSelectedCard(account)}
              isSelected={selectedCard?.card_id === account.card_id}
            />
          ),
        )}
      </View>
    </ScrollView>
  );
};

export default ChooseAccount;

const AccountCard = ({
  bank_account_num,
  bank_account_name,
  bank_name,
  onClick,
  isSelected,
  ifsc,
}: IAccount) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.accountCard,
        {
          borderColor: isSelected ? '#F3B867' : '#383838',
          backgroundColor: theme['background-basic-color-2'],
        },
      ]}
      onPress={onClick}
    >
      <View style={styles.accountBankName}>
        {/* <Icon name="credit-card-outline" style={styles.bankIcon} /> */}
        <Text style={styles.bankName}>{bank_name}</Text>
      </View>
      <Text style={styles.accNumAccName}>{bank_account_num}</Text>
      <Text style={styles.accNumAccName}>{ifsc || bank_account_name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  accountContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  accountCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    width: 180,
    minHeight: 93,
    borderWidth: 1,
  },
  addAccountCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, .15)',
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
    borderRadius: 8,
    minWidth: 180,
    minHeight: 93,
  },
  accountBankName: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  bankName: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    width: '100%',
  },
  accNumAccName: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 12,
    fontWeight: '400',
    color: '#FFFFFF',
    width: '100%',
  },
  addAccountText: {
    fontFamily: 'Montserrat, sans-serif',
    color: 'rgba(255, 255, 255, .6)',
    fontSize: 14,
    fontWeight: '600',
  },
  addIcon: {
    width: 20,
    height: 20,
    color: 'rgba(255, 255, 255, .6)',
  },
  bankIcon: {
    width: 20,
    height: 20,
    color: '#FFFFFF',
  },
});
