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
import Toast from 'react-native-toast-message';
import { useUser } from '../../../hooks/useUser';
import { useNavigation } from '@react-navigation/native';
import { TabNav } from '../../../types/nav';
import { useQuery } from '@tanstack/react-query';
import { getMenuLists } from '../../../services/user.service';
import type { IBaseResponse } from '../../../types/api';
import type { IWebInfoData } from '../../../types/ui';

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

  const { selectedOption, setSelectedOption, selectedCard } = useWithdraw();
  const { openDialog } = useDepWithCustomDialog();
  const { balance, invalidate } = useUser();

  // Fetch valid banks list from API
  const { data: webInfoData } = useQuery<IBaseResponse<IWebInfoData>>({
    queryKey: ['web-info'],
    queryFn: async () => {
      const response = await getMenuLists();
      return response;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const validBanks = webInfoData?.data?.banks || [];
  const validEWallets = webInfoData?.data?.ewallet || [];

  // Set selected option based on active withdraw option
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
  
  const formContext = useMemo(
    () => ({
      minAmount: 500,
      maxAmount: 500000,
      balance: balance?.total ? Number(balance.total) : 0,
    }),
    [balance?.total],
  );

  const resolver = useMemo(() => yupResolver(withdrawSchema), []);

  const form = useForm<WithdrawType>({
    resolver: resolver,
    context: formContext,
  });

  // Update balance and turnover in schema and re-validate when they change
  useEffect(() => {
    setCurrentBalance(balance?.total ?? 0);
    setCurrentTurnover(transactInfo?.overall_turnover_amount ?? 0);
  }, [balance?.total, transactInfo?.overall_turnover_amount]);

  // Re-validate amount when balance changes
  useEffect(() => {
    if (form.formState.dirtyFields.amount) {
      form.trigger('amount');
    }
  }, [formContext.balance, form]);

  const depositOptions: IPartnerBtnProps[] = [
    {
      isDisabled: EWallet.length === 0,
      icon: <WALLET width={40} height={40} />,
      label: t('deposit-withdraw.withdraw.e-wallet') || 'E-WALLET',
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
      label: t('deposit-withdraw.withdraw.bank') || 'BANK',
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
      label: t('deposit-withdraw.withdraw.usdt') || 'USDT',
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

    if (needsWalletPass) {
      await new Promise<void>(resolve => {
        openDialog({
          content: 'set_withdraw_pass',
          title:
            t('deposit-withdraw.withdraw.set-withdraw-password') ||
            'Set Withdraw Password!',
          submitText:
            t('deposit-withdraw.withdraw.set-withdraw-password-button') ||
            'Set Withdraw Password',
          onSuccess: () => {
            setTimeout(() => {
              openDialog({
                content: 'wallet_password',
                externalValue: {
                  device: 1,
                },
                onSuccess: () => {
                  refetch();
                  resolve();
                },
              });
            }, 500);
          },
        });
      });
    }

    // Phone verification removed - no longer required for withdrawal
  };

  const onSubmit = async () => {
    if (selectedOption.length === 0) {
      Toast.show({
        type: 'error',
        text1:
          t('deposit-withdraw.withdraw.please-add-bank-account-first') ||
          'Please add bank account first!',
      });
      return;
    }
    if (transactInfo.overall_turnover_amount > 0) {
      Toast.show({
        type: 'error',
        text1:
          t('deposit-withdraw.withdraw.please-complete-remaining-turnover') ||
          'Please complete your remaining turnover to withdraw',
      });
      return;
    }

    // Validate bank name if withdrawing to BANK account
    if (activeWithdrawOption === 'bankTransfer' && selectedCard) {
      if (
        validBanks.length > 0 &&
        !validBanks.includes(selectedCard.bank_name)
      ) {
        Toast.show({
          type: 'error',
          text1:
            t('deposit-withdraw.withdraw.invalid-bank-name') ||
            'Invalid bank name. The selected bank is not valid. Please contact customer support for assistance.',
        });
        return;
      }
    }

    // Validate e-wallet name if withdrawing to E-WALLET account
    if (activeWithdrawOption === 'eWallet' && selectedCard) {
      if (
        validEWallets.length > 0 &&
        !validEWallets.includes(selectedCard.bank_name)
      ) {
        Toast.show({
          type: 'error',
          text1:
            t('deposit-withdraw.withdraw.invalid-e-wallet-name') ||
            'Invalid e-wallet name. The selected e-wallet is not valid. Please contact customer support for assistance.',
        });
        return;
      }
    }

    // Validate form first before showing any modals
    await form.trigger('amount');

    // Show modal if there are no yup errors on the amount input
    if (!form.formState.errors.amount) {
      // Only check wallet password if validation passes
      await systemCheck();

      // Open withdraw request dialog which requires password verification
      openDialog({
        content: 'withdraw_req',
        externalForm: form,
        externalValue: {
          card_id: selectedCard?.card_id || '',
          device: 1,
        },
        onSuccess: () => {
          invalidate('balance');
          invalidate('panel-info');
          navigation.navigate('home');
          form.reset();
        },
        onClose: () => {
          form.reset();
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <BalanceWithdrawable
        cashBalance={
          balance?.total !== null && balance?.total !== undefined
            ? Number(balance.total).toFixed(2)
            : '0.00'
        }
        withdrawableBalance={
          transactInfo?.overall_turnover_amount > 0
            ? '0.00'
            : (
                (balance?.total ? balance.total : 0) -
                transactInfo?.overall_turnover_amount
              ).toFixed(2)
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
        label={
          t('deposit-withdraw.withdrawal-amount.placeholder') ||
          'Withdrawal Amount'
        }
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
