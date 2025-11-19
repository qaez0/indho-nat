import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Button } from '@ui-kitten/components';
import PartnerBtn, { type IPartnerBtnProps } from '../component/PartnerBtn';
import {
  Content,
  ChooseAccount,
  WithdrawalAmount,
  BalanceWithdrawable,
  Tutorial,
} from '../component';
import type { IPlayerCardInfo, IPlayerDetails } from '../../../types/player';
import { staticData } from '../../../constants/deposit';
import { useTranslation } from 'react-i18next';
import BANK from '../../../assets/dep-with/bank.svg';
import USDT from '../../../assets/dep-with/t.svg';
import WALLET from '../../../assets/dep-with/wallet.svg';
import { WithdrawType } from '../../../types/withdraw';
import { withdrawSchema, setCurrentBalance, setCurrentTurnover } from '../../../schemas/withdraw';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useDepWithCustomDialog,
  useWithdraw,
  useWithdrawOption,
} from '../store';
import { useEffect, useMemo } from 'react';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useUser } from '../../../hooks/useUser';
import { useNavigation } from '@react-navigation/native';
import { RootStackNav, TabNav } from '../../../types/nav';

interface ITransactionInfo {
  overall_turnover_amount: number;
  remaining_turnover_amount: number;
}

interface IWithdrawProps {
  bankInfo: IPlayerCardInfo[];
  playerInfo: IPlayerDetails;
  transactInfo: ITransactionInfo;
  isLoading: boolean;
  refetch: () => void;
  isRefetching: boolean;
}

const Withdraw = ({
  bankInfo,
  playerInfo,
  transactInfo,
  isLoading,
  isRefetching,
  refetch,
}: IWithdrawProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<TabNav>();
  const { selectedOption, setSelectedOption, selectedCard } = useWithdraw();
  const { openDialog } = useDepWithCustomDialog();
  const { balance, invalidate } = useUser();
  const { activeWithdrawOption, setActiveWithdrawOption } = useWithdrawOption();

  const EWallet = useMemo(
    () => bankInfo.filter(item => item.card_type === 'EWALLET'),
    [bankInfo],
  );
  const Bank = useMemo(
    () => bankInfo.filter(item => item.card_type === 'BANK'),
    [bankInfo],
  );
  const Usdt = useMemo(
    () => bankInfo.filter(item => item.card_type === 'CRYPTO'),
    [bankInfo],
  );

  useEffect(() => {
    if (activeWithdrawOption === 'eWallet' && EWallet.length > 0) {
      setSelectedOption(EWallet);
    } else if (activeWithdrawOption === 'bankTransfer' && Bank.length > 0) {
      setSelectedOption(Bank);
    } else if (activeWithdrawOption === 'crypto' && Usdt.length > 0) {
      setSelectedOption(Usdt);
    }
  }, [activeWithdrawOption, EWallet, Bank, Usdt, setSelectedOption]);

  useEffect(() => {
    if (selectedOption.length === 0) {
      if (EWallet.length > 0) {
        setActiveWithdrawOption('eWallet');
        setSelectedOption(EWallet);
      } else if (Bank.length > 0) {
        setActiveWithdrawOption('bankTransfer');
        setSelectedOption(Bank);
      } else if (Usdt.length > 0) {
        setActiveWithdrawOption('crypto');
        setSelectedOption(Usdt);
      }
    }
  }, [
    EWallet.length,
    Bank.length,
    Usdt.length,
    selectedOption.length,
    setSelectedOption,
    setActiveWithdrawOption,
    EWallet,
    Bank,
    Usdt,
  ]);

  const { tutorial, title } = staticData('withdraw', t);
  
  const form = useForm<WithdrawType>({
    resolver: yupResolver(withdrawSchema),
    context: {
      minAmount: 500,
      maxAmount: 500000,
    },
  });

  // Update balance and turnover in schema and re-validate when they change
  useEffect(() => {
    setCurrentBalance(balance?.total ?? 0);
    setCurrentTurnover(transactInfo?.overall_turnover_amount ?? 0);
    if (form.formState.dirtyFields.amount) {
      form.trigger('amount');
    }
  }, [balance?.total, transactInfo?.overall_turnover_amount, form]);

  const depositOptions: IPartnerBtnProps[] = [
    {
      isDisabled: EWallet.length === 0,
      icon: <WALLET width={40} height={40} />,
      label: 'E-WALLET',
      onClick: () => {
        if (EWallet.length > 0) {
          setActiveWithdrawOption('eWallet');
        }
      },
      isActive: activeWithdrawOption === 'eWallet',
    },
    {
      isDisabled: Bank.length === 0,
      icon: <BANK width={40} height={40} />,
      label: 'BANK',
      onClick: () => {
        if (Bank.length > 0) {
          setActiveWithdrawOption('bankTransfer');
        }
      },
      isActive: activeWithdrawOption === 'bankTransfer',
    },
    {
      isDisabled: Usdt.length === 0,
      icon: <USDT width={40} height={40} />,
      label: 'USDT',
      onClick: () => {
        if (Usdt.length > 0) {
          setActiveWithdrawOption('crypto');
        }
      },
      isActive: activeWithdrawOption === 'crypto',
    },
  ];

  const systemCheck = async () => {
    const needsWalletPass = playerInfo.has_wallet_pass === false;
    const needsPhoneVerification = playerInfo.phone_validation === false;

    if (needsWalletPass) {
      await new Promise<void>(resolve => {
        openDialog({
          content: 'set_withdraw_pass',
          title: 'Set Withdraw Password!',
          submitText: 'Set Withdraw Password',
          onSuccess: () => {
            setTimeout(() => {
              openDialog({
                content: 'wallet_password',
                externalValue: {
                  device: 1,
                },
                onSuccess: () => {
                  refetch();
                  Toast.show({
                    type: 'success',
                    text1: 'Withdraw password set successfully',
                  });
                  resolve();
                },
              });
            }, 200);
          },
        });
      });
    }

    if (needsPhoneVerification) {
      await new Promise<void>(resolve => {
        const openPhoneVerification = () => {
          openDialog({
            title: '🔒 Mobile Verification Required',
            content: 'otp_verify',
            externalValue: {
              phone: playerInfo.phone,
              device: 1,
            },
            onSuccess: () => {
              refetch();
              Toast.show({
                type: 'success',
                text1: 'Phone number verified successfully',
              });
              resolve();
              form.reset();
            },
          });
        };

        if (needsWalletPass) {
          setTimeout(openPhoneVerification, 200);
        } else {
          openPhoneVerification();
        }
      });
    }
  };

  const onSubmit = () => {
    if (selectedOption.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please add bank account first!',
      });
      return;
    }
    // Turnover validation is now handled by Yup schema
    systemCheck();
    form.trigger().finally(() => {
      if (
        form.formState.dirtyFields.amount &&
        !form.formState.errors.amount &&
        playerInfo.has_wallet_pass === true &&
        playerInfo.phone_validation === true
      ) {
        openDialog({
          content: 'withdraw_req',
          externalForm: form,
          externalValue: {
            card_id: selectedCard?.card_id || '',
          },
          onSuccess: () => {
            Toast.show({
              type: 'success',
              text1: 'Withdrawal successful',
            });
            invalidate('balance');
            navigation.navigate('home');
            form.reset();
          },
          onClose: () => {
            form.reset();
          },
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      <BalanceWithdrawable
        cashBalance={balance?.total.toString() || '0'}
        withdrawableBalance={
          transactInfo?.overall_turnover_amount > 0
            ? '0'
            : (
                (balance?.total ? balance.total : 0) -
                transactInfo?.overall_turnover_amount
              ).toString()
        }
      />
      <View style={styles.mobileOptions}>
        {depositOptions.map((option, index) => (
          <PartnerBtn key={index} {...option} />
        ))}
      </View>
      <Content
        label={t('deposit-withdraw.choose-account.choose-account')}
        content={<ChooseAccount accounts={selectedOption} />}
      />
      <Content
        label={t('deposit-withdraw.withdrawal-amount.label')}
        content={
          <WithdrawalAmount
            customInputProps={{
              name: 'amount',
              form: form,
              placeholder: t('deposit-withdraw.withdrawal-amount.placeholder'),
              keyboardType: 'numeric',
            }}
            remainingTurnover={transactInfo.overall_turnover_amount}
            refetch={refetch}
            isLoading={isLoading}
          />
        }
      />
      <Button
        onPress={onSubmit}
        appearance="filled"
        status="success"
        accessoryLeft={() =>
          isLoading || isRefetching ? (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
            >
              <ActivityIndicator size="small" color="#fff" />
              <Text>{t('wheel.please-wait')}</Text>
            </View>
          ) : (
            <Text style={{ color: '#000', fontWeight: 'bold' }}>
              {t('deposit-withdraw.deposit.submit')}
            </Text>
          )
        }
        disabled={isLoading || isRefetching}
      />
      <Content
        label={title}
        content={<Tutorial tutorial={tutorial} forWithdraw />}
      />
    </View>
  );
};

export default Withdraw;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  mobileOptions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 16,
  },
});
