import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNav } from '../../../types/nav';
import Toast from 'react-native-toast-message';
import {
  useDepOption,
  useDepWithCustomDialog,
  useSelectedOption,
} from '../store';
import {
  BankCard,
  Content,
  CustomInput,
  Tutorial,
  OptionResult,
  AmountInputSelect,
  PartnerBtn,
  type IPartnerBtnProps,
  UploadInput,
  UsdtAddressCard,
} from '../component';
import type { IPlayerDetails } from '../../../types/player';
import type { IChannelGroup } from '../../../types/player';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type {
  BankType,
  CryptoType,
  OnlinePayType,
} from '../../../types/deposit';
import {
  bankSchema,
  cryptoSchema,
  onlinePaySchema,
} from '../../../schemas/deposit';
import { useTranslation } from 'react-i18next';
import { staticData } from '../../../constants/deposit';
import UPI from '../../../assets/dep-with/fast-pay.svg';
import UPIACT from '../../../assets/dep-with/fast-pay-active.svg';
import WALLET from '../../../assets/dep-with/e-wallet.svg';
import USDT from '../../../assets/dep-with/t.svg';
// import BANK from '../../../assets/dep-with/bank.svg';
import { useDepositWithdrawApi } from '../store/useDepositWithdraw';
import { usePopUp } from '../../../store/useUIStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IDepositProps {
  details: {
    eWallet: IChannelGroup[];
    fastPay: IChannelGroup[];
    easyPay: IChannelGroup[];
    crypto: IChannelGroup[];
    bankTransfer: IChannelGroup[];
    playerInfo: IPlayerDetails;
  };
  isLoading: boolean;
  refetch: () => void;
  isRefetching: boolean;
  isAuthenticated: boolean;
  openInIframe?: (url: string) => void;
}

export type DepositOption = 'E-WALLET' | 'BANK' | 'USDT CRYPTO';

export const DepositOptions = {
  fastPay: 'FAST PAY',
  eWallet: 'E-WALLET',
  crypto: 'USDT CRYPTO',
} as const;

const Deposit = ({
  details,
  isLoading,
  refetch,
  isRefetching,
  isAuthenticated,
  openInIframe,
}: IDepositProps) => {
  const navigation = useNavigation<RootStackNav>();
  const { t } = useTranslation();
  const { crypto, eWallet, fastPay, bankTransfer } = details;
  const { activeDepOption, setActiveDepOption } = useDepOption();
  const { tutorial, title } = staticData(activeDepOption, t);
  const { selectedOption, setSelectedOption } = useSelectedOption();
  const { onlinePayRequest, depositRequestB2B } = useDepositWithdrawApi();
  const { openDialog } = useDepWithCustomDialog();
  const [shouldShowKycModal, setShouldShowKycModal] = useState(false);
  const { isOpen: isPopUpOpen } = usePopUp();

  const onlinePayForm = useForm<OnlinePayType>({
    resolver: yupResolver(onlinePaySchema),
    context: {
      minAmount: selectedOption?.amount_min,
      maxAmount: selectedOption?.amount_max,
    },
  });
  const bankForm = useForm<BankType>({
    resolver: yupResolver(bankSchema),
    context: {
      minAmount: selectedOption?.amount_min,
      maxAmount: selectedOption?.amount_max,
    },
  });

  const bankFormUpi = useForm<BankType>({
    resolver: yupResolver(bankSchema),
    context: {
      minAmount: selectedOption?.amount_min,
      maxAmount: selectedOption?.amount_max,
    },
  });

  const cryptoForm = useForm<CryptoType>({
    resolver: yupResolver(cryptoSchema),
    context: {
      minAmount: selectedOption?.amount_min,
      maxAmount: selectedOption?.amount_max,
    },
  });

  const resetAllForms = useCallback(() => {
    onlinePayForm.reset();
    bankForm.reset();
    bankFormUpi.reset();
    cryptoForm.reset();
  }, [onlinePayForm, bankForm, bankFormUpi, cryptoForm]);

  useEffect(() => {
    const options = details[activeDepOption];
    if (options && options.length > 0) {
      setSelectedOption(options[0], 0);
    }
  }, [activeDepOption, details, setSelectedOption]);

  useEffect(() => {
    resetAllForms();
  }, [activeDepOption, resetAllForms]);

  // Reset to fastPay and reset all forms when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Reset to fastPay when screen comes into focus
      setActiveDepOption('fastPay');
      resetAllForms();
      
      // Cleanup function runs when screen loses focus (user navigates away)
      return () => {
        resetAllForms();
      };
    }, [resetAllForms, setActiveDepOption]),
  );

  const cryptoAmount = cryptoForm.watch('amount');

  useEffect(() => {
    if (activeDepOption === 'crypto') {
      cryptoForm.setValue(
        'amount_in_rupees',
        cryptoAmount ? cryptoAmount * Number(selectedOption?.xrate || 0) : null,
        { shouldValidate: true },
      );
    }
  }, [cryptoAmount, selectedOption?.xrate, activeDepOption, cryptoForm]);

  // Keep state false while popup is open
  useEffect(() => {
    if (isPopUpOpen) {
      setShouldShowKycModal(false);
    }
  }, [isPopUpOpen]);

  // Event listener: When popup modal closes, set state to true (unless user navigated to game)
  useEffect(() => {
    const handlePopupStateChange = async () => {
      // Track if popup was open
      const wasPopUpOpen = (await AsyncStorage.getItem("was-popup-open")) === "true";
      
      // If popup was just closed
      if (!isPopUpOpen && wasPopUpOpen) {
        // Check if user clicked free-spin-bonus (rise-of-seth) and navigated to game
        const navigatedToGame = (await AsyncStorage.getItem("navigated-to-game")) === "true";
        
        if (!navigatedToGame) {
          // User closed popup without navigating to game - set state to true to show KYC modal
          setShouldShowKycModal(true);
        } else {
          // User navigated to game - keep state false, clear flag
          await AsyncStorage.removeItem("navigated-to-game");
          setShouldShowKycModal(false);
        }
        
        // Clear the tracking flag
        await AsyncStorage.removeItem("was-popup-open");
      }
      
      // Track popup state when it opens
      if (isPopUpOpen) {
        await AsyncStorage.setItem("was-popup-open", "true");
      }
    };

    handlePopupStateChange();
  }, [isPopUpOpen]);



  const { isOpen } = usePopUp();

  useEffect(() => {
    if (details?.playerInfo?.real_name === '' && shouldShowKycModal) {
      openDialog({
        title: t('kyc.please-complete-kyc'),
        content: 'real_name',
        onSuccess: refetch,
      });
    }
  }, [details?.playerInfo?.real_name, shouldShowKycModal]);

  const onSubmit = () => {
    if (
      isAuthenticated &&
      !details?.playerInfo.real_name &&
      !isLoading &&
      !isRefetching
    ) {
      openDialog({
        title: t('kyc.please-complete-kyc'),
        content: 'real_name',
        onSuccess: refetch,
      });
      return resetAllForms();
    }
    if (activeDepOption === 'eWallet' || activeDepOption === 'fastPay') {
      onlinePayForm.handleSubmit(async data => {
        try {
          console.log('Submitting deposit request:', {
            amount: data.amount,
            channel_id: selectedOption?.channel_id,
            activeDepOption,
          });
          await onlinePayRequest.mutateAsync({
            req: {
              ...data,
              channel_id: selectedOption?.channel_id,
            },
            openInIframe,
          });
          resetAllForms();
        } catch (error) {
          console.error('E-Wallet/FastPay deposit submission error:', error);
          console.error('Error details:', {
            error,
            amount: data.amount,
            channel_id: selectedOption?.channel_id,
            activeDepOption,
          });
        }
      })();
    }

    if (activeDepOption === 'crypto') {
      cryptoForm.handleSubmit(async data => {
        try {
          console.log('Submitting crypto deposit request:', {
            amount: data.amount,
            amount_in_rupees: data.amount_in_rupees,
            channel_id: selectedOption?.channel_id,
          });
          await onlinePayRequest.mutateAsync({
            req: {
              ...data,
              channel_id: selectedOption?.channel_id,
            },
            openInIframe,
          });
          resetAllForms();
        } catch (error) {
          console.error('Crypto deposit request failed:', error);
          console.error('Error details:', {
            error,
            amount: data.amount,
            amount_in_rupees: data.amount_in_rupees,
            channel_id: selectedOption?.channel_id,
          });
        }
      })();
    }
    if (activeDepOption === 'bankTransfer') {
      bankForm.handleSubmit(async data => {
        console.log('Submitting bank transfer deposit:', data);
        try {
          const payload = {
            ...data,
            ref_id: data.reference_number,
            group: selectedOption?.group,
            channel_id: selectedOption?.channel_id,
          };
          console.log('Bank transfer payload:', payload);
          await depositRequestB2B(payload);
          resetAllForms();
          // Show toast and navigate to transaction record after successful B2B deposit
          Toast.show({
            text1: 'Deposit request submitted for review',
            type: 'success',
          });
          navigation.navigate('transaction-record');
        } catch (error: any) {
          // Error is already handled in depositRequestB2B (including pending request case)
          // Only log if it's not a pending request error (which is already handled)
          let message: string | null = null;
          try {
            message = error?.message ? JSON.parse(error?.message)?.message : null;
          } catch (parseError) {
            // If parsing fails, try to get message from error directly
            message = error?.message || error?.data?.message || null;
          }
          if (
            message !==
            'You have a pending deposit request. Please wait for the previous request to be processed.'
          ) {
            console.error('Bank deposit request failed:', error);
          }
          console.error('Error details:', {
            error,
            data,
            group: selectedOption?.group,
            channel_id: selectedOption?.channel_id,
          });
        }
      })();
    }

    if (activeDepOption === 'easyPay') {
      const errors = bankFormUpi.formState.errors;
      console.log('EasyPay form errors:', errors);
      bankFormUpi.handleSubmit(async data => {
        console.log('Submitting EasyPay deposit:', data);
        try {
          const payload = {
            ...data,
            group: selectedOption?.group,
            channel_id: selectedOption?.channel_id,
          };
          console.log('EasyPay payload:', payload);
          await depositRequestB2B(payload);
          resetAllForms();
        } catch (error) {
          console.error('EasyPay deposit request failed:', error);
          console.error('Error details:', {
            error,
            data,
            group: selectedOption?.group,
            channel_id: selectedOption?.channel_id,
          });
        }
      })();
    }
  };

  const depositOptions: IPartnerBtnProps[] = [
    {
      icon:
        activeDepOption === 'fastPay' ? (
          <UPIACT width={40} height={40} />
        ) : (
          <UPI width={40} height={40} />
        ),
      label: t('deposit-withdraw.deposit.fast-pay'),
      onClick: () => {
        resetAllForms();
        setActiveDepOption('fastPay');
      },
      isActive: activeDepOption === 'fastPay',
      isDisabled: fastPay.length === 0,
    },
    {
      icon: (
        <WALLET
          width={40}
          height={40}
          color={activeDepOption === 'eWallet' ? '#000' : '#FFFFFF'}
        />
      ),
      label: t('deposit-withdraw.deposit.e-wallet'),
      onClick: () => {
        resetAllForms();
        setActiveDepOption('eWallet');
      },
      isActive: activeDepOption === 'eWallet',
      isDisabled: eWallet.length === 0,
    },
    {
      icon: <USDT width={40} height={40} />,
      label: 'USDT',
      onClick: () => {
        resetAllForms();
        setActiveDepOption('crypto');
      },
      isActive: activeDepOption === 'crypto',
      isDisabled: crypto.length === 0,
    },
    // {
    //   icon: <BANK width={40} height={40} />,
    //   label: t('deposit-withdraw.deposit.bank-transfer'),
    //   onClick: () => {
    //     resetAllForms();
    //     setActiveDepOption('bankTransfer');
    //   },
    //   isActive: activeDepOption === 'bankTransfer',
    //   isDisabled: bankTransfer.length === 0,
    // },
  ];

  const RenderContent = () => {
    // Reorder UPI options: Group EasyPaisa together, then JazzCash
    const reorderUpiOptions = (data: any[]) => {
      if (activeDepOption === 'fastPay') {
        const orderMap: Record<string, number> = {
          // EasyPaisa options grouped together
          MEGA_EASYPAISA: 1,
          DY_EASYPAISA: 2,
          TOPPAY_EASYPAISA: 3,
          GAMEPAYER_EASYPAISA: 4,
          // JazzCash options grouped together
          DY_JAZZCASH: 5,
          MEGA_JAZZCASH: 6,
          TOPPAY_JAZZCASH: 7,
          GAMEPAYER_JAZZCASH: 8,
        };
        const reorder = [...data].sort((a, b) => {
          const orderA = orderMap[a.channel_id] || 999; // Unknown gateways go to the end
          const orderB = orderMap[b.channel_id] || 999;
          return orderA - orderB;
        });


        console.log(reorder)
        return reorder 
      }
      return data;
    };

    switch (activeDepOption) {
      case 'fastPay':
      case 'eWallet':
        return (
          <Fragment key={`${activeDepOption}-${selectedOption?.channel_id}`}>
            <Content
              isLoading={isLoading}
              label={DepositOptions[activeDepOption]}
              content={
                <OptionResult
                  data={reorderUpiOptions(details[activeDepOption])}
                />
              }
            />
            <Content
              label={t('deposit-withdraw.deposit.select-amount')}
              content={
                <Fragment>
                  <AmountInputSelect
                    value={onlinePayForm.watch('amount')?.toString()}
                    amounts={selectedOption?.amount_options}
                    onAmountChange={e =>
                      onlinePayForm.setValue('amount', e, {
                        shouldValidate: true,
                      })
                    }
                  />
                  <CustomInput
                    name="amount"
                    placeholder={
                      selectedOption?.amount_min && selectedOption?.amount_max
                        ? t('deposit-withdraw.deposit.deposit-limit', {
                            max: selectedOption.amount_max,
                            min: selectedOption.amount_min,
                          })
                        : t('deposit-withdraw.deposit.input-amount')
                    }
                    form={onlinePayForm}
                    currency="PKR"
                  />
                </Fragment>
              }
            />
          </Fragment>
        );
      case 'easyPay':
        return (
          <Fragment>
            <Content
              isLoading={isLoading}
              label={'Easy Pay'}
              content={
                <OptionResult
                  data={details[activeDepOption]}
                  reset={resetAllForms}
                />
              }
            />
            <UsdtAddressCard
              address={selectedOption?.bank_account_num}
              image={selectedOption?.qr_image_url}
              title="Scan Qr and Pay"
            />
            <Content
              label="Add Paid Amount"
              content={
                <CustomInput
                  placeholder={
                    selectedOption?.amount_min && selectedOption?.amount_max
                      ? `Deposit Limit ${selectedOption?.amount_min} - ${selectedOption?.amount_max}`
                      : 'Input amount'
                  }
                  name="amount"
                  inputMode="numeric"
                  form={bankFormUpi}
                />
              }
            />
            <Content
              label="Proof of Transaction"
              content={<UploadInput form={bankFormUpi} name="image" uploadKey="easyPay-upload" />}
            />
          </Fragment>
        );
      case 'bankTransfer':
        return (
          <Fragment key={`${activeDepOption}-${selectedOption?.channel_id}`}>
            <Content
              label={'BANK TRANSFER'}
              content={
                <BankCard
                  bankName={selectedOption?.bank_name}
                  accountName={selectedOption?.bank_account_name}
                  accountNumber={selectedOption?.bank_account_num}
                />
              }
            />
            <Content
              label={t('deposit-withdraw.deposit.deposit-amount')}
              content={
                <CustomInput
                  inputMode="numeric"
                  placeholder={
                    selectedOption?.amount_min && selectedOption?.amount_max
                      ? `Deposit Limit ${selectedOption?.amount_min} - ${selectedOption?.amount_max}`
                      : 'Input amount'
                  }
                  name="amount"
                  form={bankForm}
                />
              }
            />
            <Content
              label={'Reference Number'}
              content={
                <CustomInput
                  placeholder={'Please Enter the UTR/Reference No.'}
                  name="reference_number"
                  form={bankForm}
                  inputMode="numeric"
                  keyboardType="numeric"
                  onChangeText={(text: string) => {
                    // Only allow numeric characters
                    const numericText = text.replace(/[^0-9]/g, '');
                    bankForm.setValue('reference_number', numericText, {
                      shouldValidate: true,
                    });
                  }}
                />
              }
            />
            <Content
              label={'Proof of Transaction'}
              content={<UploadInput form={bankForm} name="image" uploadKey="bank-upload" />}
            />
          </Fragment>
        );
      case 'crypto':
        return (
          <Fragment key={`${activeDepOption}-${selectedOption?.channel_id}`}>
            <Content
              isLoading={isLoading}
              label={DepositOptions[activeDepOption]}
              content={<OptionResult data={crypto} />}
            />
            {/* {address && <UsdtAddressCard address={address} />} */}
            <Content
              label={t('deposit-withdraw.deposit.deposit-amount')}
              subLabel={`Currency (1 USDT = ${selectedOption?.xrate} PKR)`}
              content={
                <Fragment>
                  <CustomInput
                    placeholder={
                      selectedOption?.amount_min && selectedOption?.amount_max
                        ? t('deposit-withdraw.deposit.deposit-limit', {
                            min: selectedOption.amount_min,
                            max: selectedOption.amount_max,
                          })
                        : t('deposit-withdraw.deposit.input-amount')
                    }
                    name="amount"
                    inputMode="numeric"
                    form={cryptoForm}
                    currency="USDT"
                  />
                  <CustomInput
                    placeholder={t('deposit-withdraw.deposit.amount-in-pkr')}
                    name="amount_in_rupees"
                    form={cryptoForm}
                    currency="PKR"
                    readOnly
                  />
                </Fragment>
              }
            />
          </Fragment>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mobileOptions}>
        {depositOptions.map((option, index) => (
          <PartnerBtn key={index} {...option} />
        ))}
      </View>
      {RenderContent()}
      <Button
        onPress={onSubmit}
        appearance="filled"
        status="success"
        accessoryLeft={() =>
          isLoading || isRefetching || onlinePayRequest.isPending ? (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
            >
              <ActivityIndicator size="small" color="#fff" />
              <Text>{t('common-terms.please-wait')}</Text>
            </View>
          ) : (
            <Text style={{ color: '#000', fontWeight: 'bold' }}>
              {t('deposit-withdraw.deposit.submit')}
            </Text>
          )
        }
        disabled={isLoading || isRefetching || onlinePayRequest.isPending}
      />
      <Content
        label={title}
        content={<Tutorial tutorial={tutorial} />}
        labelStyle={{
          textDecorationLine: 'underline',
        }}
      />
    </View>
  );
};

export default Deposit;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  mobileOptions: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
});
