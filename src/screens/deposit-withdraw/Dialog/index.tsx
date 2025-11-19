import { View, StyleSheet, ActivityIndicator, Keyboard } from 'react-native';
import { Text, Button, Modal } from '@ui-kitten/components';
import AskRealName from './component/AskRealName';
import PhoneVerify from './component/PhoneVerify';
import SetWithdrawPass from './component/SetWithdrawPass';
import WithdrawalPass from './component/WithdrawalPass';
import WithdrawReq from './component/WithdrawReq';
import { useDepWithCustomDialog, useOtp } from '../store';
import { useForm, UseFormReturn } from 'react-hook-form';
import {
  CreateWithdrawalPasswordType,
  UpdateRealNameType,
  VerfiyPhoneNumber,
  VerifyPhoneNumberType,
} from '../../../types/player';
import {
  addPhoneNumberSchema,
  createWithdrawalPasswordSchema,
  updateRealNameSchema,
  verfiyPhoneNumberSchema,
} from '../../../schemas/player';
import { yupResolver } from '@hookform/resolvers/yup';
import LinearGradient from 'react-native-linear-gradient';
import { useDepositWithdrawApi } from '../store/useDepositWithdraw';
import { WithdrawType } from '../../../types/withdraw';
import Toast from 'react-native-toast-message';
import toastConfig from '../../../components/toast';
import { useEffect, useState } from 'react';
import { useVerify } from '../../../hooks/useVerify';
import { useTranslation } from 'react-i18next';

const DepWithCustomDialog = () => {
  const { t } = useTranslation();
  const { visibility, config, closeDialog } = useDepWithCustomDialog();
  const { lastSent, setLastSent, clearLastSent } = useOtp();
  const {
    requestOtpRequest,
    verifyPhoneNumberRequest,
    createWithdrawalPasswordRequest,
    withdrawRequest,
    updateRealNameRequest,
  } = useDepositWithdrawApi();
  const { addNewPhone } = useVerify();
  const [countdown, setCountdown] = useState<number>(0);
  const [behaviour, setBehaviour] = useState<'height' | undefined>(undefined);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setBehaviour('height');
    });
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setBehaviour(undefined);
    });
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const updateRealNameForm = useForm<UpdateRealNameType>({
    resolver: yupResolver(updateRealNameSchema),
  });
  const createWithdrawalPasswordForm = useForm<CreateWithdrawalPasswordType>({
    resolver: yupResolver(createWithdrawalPasswordSchema),
  });
  const verifyPhoneNumberForm = useForm<VerfiyPhoneNumber>({
    resolver: yupResolver(verfiyPhoneNumberSchema),
  });

  const addPhoneNumberForm = useForm<VerifyPhoneNumberType>({
    resolver: yupResolver(addPhoneNumberSchema),
    defaultValues: {
      phone: config?.externalValue?.phone,
    },
  });

  useEffect(() => {
    if (
      config?.content === 'otp_verify' &&
      lastSent === null &&
      config?.externalValue?.phone !== ''
    ) {
      requestOtpRequest.mutate({
        phone: config?.externalValue?.phone,
        onSucc: setLastSent,
      });
    }
  }, [config?.content]);

  const onSuccessBase = () => {
    closeDialog();
    config?.onSuccess?.();
  };

  useEffect(() => {
    if (lastSent && config?.content === 'otp_verify') {
      const timeLeft = Math.max(
        0,
        Math.floor(
          (new Date(lastSent).getTime() + 60000 - new Date().getTime()) / 1000,
        ),
      );
      setCountdown(timeLeft);

      if (timeLeft > 0) {
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              clearLastSent();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } else {
        clearLastSent();
      }
    }
  }, [lastSent, clearLastSent, config?.content]);

  const DataContent = {
    real_name: {
      content: <AskRealName form={updateRealNameForm} />,
      onSubmit: () => {
        updateRealNameForm.handleSubmit(data => {
          updateRealNameRequest(data, onSuccessBase);
        })();
      },
    },
    wallet_password: {
      content: <WithdrawalPass form={createWithdrawalPasswordForm} />,
      onSubmit: () => {
        createWithdrawalPasswordForm.handleSubmit(data => {
          createWithdrawalPasswordRequest(data, () => {
            onSuccessBase();
            createWithdrawalPasswordForm.reset();
          });
        })();
      },
    },
    otp_verify: {
      content: (
        <PhoneVerify
          otpForm={verifyPhoneNumberForm}
          phoneForm={addPhoneNumberForm}
          phone={config?.externalValue?.phone}
          otpSettings={{
            onClick: () => {
              if (config?.externalValue?.phone === '') {
                const phone = addPhoneNumberForm.getValues('phone');
                console.log(phone);
                addNewPhone(
                  {
                    phone: `91${phone}`,
                  },
                  setLastSent,
                );
              } else {
                requestOtpRequest.mutate({
                  phone: config?.externalValue?.phone || '',
                  onSucc: setLastSent,
                });
              }
            },
            secondsLeft: countdown,
            isRunning: lastSent !== null,
            label: 'send code',
            isLoading: requestOtpRequest.isPending,
          }}
        />
      ),
      onSubmit: () => {
        verifyPhoneNumberForm.handleSubmit(data => {
          verifyPhoneNumberRequest(
            { ...data, ...config?.externalValue },
            onSuccessBase,
          );
        })();
      },
    },
    withdraw_req: {
      content: (
        <WithdrawReq
          form={config?.externalForm as UseFormReturn<WithdrawType>}
        />
      ),
      onSubmit: () => {
        config?.externalForm?.handleSubmit(data => {
          withdrawRequest.mutate({
            ...data,
            ...config?.externalValue,
            onSucc: onSuccessBase,
          });
        })();
      },
    },
    set_withdraw_pass: {
      content: <SetWithdrawPass />,
      onSubmit: onSuccessBase,
    },
  };

  const isSubmitting = withdrawRequest.isPending;

  return (
    <Modal
      visible={visibility}
      animationType="fade"
      style={{
        ...styles.modal,
        justifyContent: 'center',
      }}
      hardwareAccelerated={true}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => {
        closeDialog();
        config?.onClose?.();
        createWithdrawalPasswordForm.reset();
      }}
    >
      <LinearGradient
        colors={['#000000', '#615038']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.modalContent}
      >
        {config?.title && (
          <View style={styles.container}>
            <Text style={styles.title}>{config.title}</Text>
          </View>
        )}
        <View style={styles.content}>
          {DataContent[config?.content as keyof typeof DataContent]?.content}
        </View>
        <View style={styles.actions}>
          <Button
            status="primary"
            appearance="filled"
            onPress={() => {
              closeDialog();
              config?.onClose?.();
              createWithdrawalPasswordForm.reset();
            }}
            style={{ minWidth: 75 }}
            disabled={isSubmitting}
          >
            {t('message-center.delete-confirm-dialog.close')}
          </Button>
          <Button
            disabled={isSubmitting}
            status="success"
            appearance="filled"
            accessoryLeft={
              isSubmitting
                ? () => <ActivityIndicator size="small" color="#fff" />
                : undefined
            }
            style={{ flex: 1 }}
            onPress={() => {
              DataContent[
                config?.content as keyof typeof DataContent
              ]?.onSubmit?.();
            }}
          >
            {isSubmitting ? t('wheel.please-wait') : config?.submitText || t('deposit-withdraw.deposit.submit')}
          </Button>
        </View>
      </LinearGradient>
      <Toast config={toastConfig} position="top" visibilityTime={3000} />
    </Modal>
  );
};

export default DepWithCustomDialog;

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    height: '100%',
    display: 'flex',
    padding: 20,
    zIndex: 1000,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
    flexDirection: 'column',
    gap: 10,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  title: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    gap: 13,
  },
  baseButton: {
    flex: 1,
    height: 40,
    borderRadius: 6,
  },
  close: {
    backgroundColor: 'rgba(255, 255, 255, .1)',
  },
  confirm: {
    backgroundColor: '#F3B867',
  },
});
