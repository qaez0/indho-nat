import type { IDepositRequestB2BPayload } from '../../../types/deposit';
import type { OnlinePayRequestParams } from '../../../types/deposit';
import type {
  CreateWithdrawalPasswordType,
  RequestOtp,
  UpdateRealNameType,
  VerfiyPhoneNumber,
} from '../../../types/player';
import type { WithdrawRequest } from '../../../types/withdraw';
import Toast from 'react-native-toast-message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  depositReqB2B,
  onlinePayReq,
  withdrawReq,
  notifyWithdrawalSuccess,
} from '../../../services/dep-with.service';
import { CANT_USE_IFRAME_CHANNELS } from '../../../constants/deposit';
import { Linking } from 'react-native';
import { RootStackNav } from '../../../types/nav';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createWithdrawalPassword,
  requestOtpPhoneVerification,
  updateWalletPassOrRealName,
  verifyPhoneNumber,
} from '../../../services/user.service';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../hooks/useUser';

export const useDepositWithdrawApi = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<RootStackNav>();
  const { t } = useTranslation();
  const { invalidate } = useUser();

  const onlinePayRequest = useMutation({
    mutationFn: async ({ req }: OnlinePayRequestParams) => {
      const payload = {
        amount: req.amount,
        channel_id: req.channel_id,
        domain: 'game11ic://transaction-record',
        image: null,
      };
      return onlinePayReq(payload);
    },
    onMutate: () => {
      Toast.show({
        text1: t('deposit-withdraw.deposit.processing-deposit'),
        type: 'promise',
        autoHide: false,
      });
    },
    onSuccess: async (res, variables) => {
      Toast.hide();
      const isUrl = res?.data?.payment_type === 'URL';
      if (isUrl) {
        const url = res.data.urllink;

        // Save payment URL to AsyncStorage for continue payment functionality
        try {
          await AsyncStorage.setItem('pending_payment_url', url);
          // Also save with timestamp for reference
          await AsyncStorage.setItem(
            'pending_payment_timestamp',
            Date.now().toString(),
          );
        } catch (error) {
          console.warn('Failed to save payment URL to storage:', error);
        }

        if (variables.openInIframe) {
          if (CANT_USE_IFRAME_CHANNELS.includes(variables.req.channel_id)) {
            Linking.openURL(url);
          }
          variables.openInIframe(url);
        } else {
          Linking.openURL(url);
        }
        Toast.show({
          text1: 'Redirecting...',
          type: 'success',
        });
        invalidate('panel-info');
      } else {
        Toast.show({
          text1: 'Deposit successful',
          type: 'success',
        });
      }
    },
    onError: (error: any) => {
      Toast.hide();

      let message = 'An error occurred';
      try {
        const parsed = JSON.parse(error?.message || '{}');
        message = parsed?.message || error?.message || 'An error occurred';
      } catch (parseError) {
        message = error?.message || 'An error occurred';
        Toast.show({
          text1: 'Error',
          text2: 'Failed to process error message',
          type: 'error',
        });
      }

      if (
        message ===
        'You have a pending deposit request. Please wait for the previous request to be processed.'
      ) {
        Toast.show({
          text1: t('deposit-withdraw.deposit.pending-deposit-request'),
          type: 'error',
        });
        navigation.navigate('transaction-record');
      } else {
        Toast.show({
          text1: message,
          type: 'error',
        });
      }
    },
  });

  const depositRequestB2B = async (payload: IDepositRequestB2BPayload) => {
    Toast.show({
      text1: t('deposit-withdraw.deposit.processing-deposit'),
      type: 'promise',
      autoHide: false,
    });

    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      
      // Append all fields to FormData
      formData.append('amount', String(payload.amount));
      formData.append('group', payload.group);
      formData.append('channel_id', payload.channel_id);
      formData.append('device', '1');
      
      if (payload.ref_id) {
        formData.append('ref_id', payload.ref_id);
      }
      
      if (payload.bank_account_name) {
        formData.append('bank_account_name', payload.bank_account_name);
      }
      
      if (payload.bank_account_num) {
        formData.append('bank_account_num', payload.bank_account_num);
      }
      
      if (payload.bank_name) {
        formData.append('bank_name', payload.bank_name);
      }
      
      if (payload.min_deposit) {
        formData.append('min_deposit', String(payload.min_deposit));
      }
      
      if (payload.max_deposit) {
        formData.append('max_deposit', String(payload.max_deposit));
      }
      
      // Append image file - React Native FormData format
      if (payload.image && payload.image.uri) {
        formData.append('image', {
          uri: payload.image.uri,
          type: payload.image.type || 'image/jpeg',
          name: payload.image.name || 'image.jpg',
        } as any);
      } else if (payload.image) {
        // Fallback if image is already in correct format
        formData.append('image', payload.image as any);
      }
      
      const response = await depositReqB2B(formData as any);
      Toast.hide();
      if (typeof response.data === 'boolean' && response.data === false) {
        Toast.show({
          text1:
            response.message.charAt(0).toUpperCase() +
              response.message.slice(1) ||
            'Failed to deposit, please try again.',
          type: 'error',
        });
        return;
      }
       // Note: Toast and navigation are handled in Deposit component for better UX
      // This function just handles the API call and error cases
      invalidate('panel-info');
      // Invalidate deposit records queries so the new transaction appears in transaction record
      queryClient.invalidateQueries({
        queryKey: ['deposit-records'],
      });
      queryClient.invalidateQueries({
        queryKey: ['all-deposit-records'],
      });
    } catch (error: any) {
      Toast.hide();

      let message: string | null = null;
      try {
        message = JSON.parse(error?.message)?.message;
      } catch (parseError) {
        // If parsing fails, try to get message from error directly
        message = error?.message || error?.data?.message || null;
      }
      
      try {
        const parsed = JSON.parse(error?.message || '{}');
        message = parsed?.message || error?.message || 'An error occurred';
      } catch (parseError) {
        message =
          error?.message || 'An unexpected error occurred. Please try again.';
        Toast.show({
          text1: 'Error',
          text2: 'Failed to process error message',
          type: 'error',
        });
      }

      if (
        message ===
        'You have a pending deposit request. Please wait for the previous request to be processed.'
      ) {
        // Show pending request message toast when redirecting to transaction record
        navigation.navigate('transaction-record');
        // Use setTimeout to ensure navigation happens first, then show toast
        setTimeout(() => {
          Toast.show({
            text1: message,
            type: 'error',
          });
        }, 100);
      } else {
        Toast.show({
          text1: message || 'An unexpected error occurred. Please try again.',
          type: 'error',
        });
      }
      // Re-throw error so Deposit component knows not to show success toast
      throw error;
    }
  };

  const updateRealNameRequest = async (
    payload: UpdateRealNameType,
    onSucc: () => void,
  ) => {
    Toast.show({
      text1: 'Updating real name...',
      type: 'promise',
      autoHide: false,
    });

    try {
      const response = await updateWalletPassOrRealName(payload);
      Toast.hide();
      if (typeof response.data === 'boolean' && response.data === false) {
        Toast.show({
          text1:
            response.message.charAt(0).toUpperCase() +
              response.message.slice(1) ||
            'Failed to update real name, please try again.',
          type: 'error',
        });
        return;
      }
      Toast.show({
        text1: 'Real name updated successfully',
        type: 'success',
      });
      onSucc();
    } catch (error: any) {
      const message = error?.data?.message;
      Toast.show({
        text1: message,
        type: 'error',
      });
    }
  };

  const requestOtpMutation = useMutation({
    mutationFn: async (payload: RequestOtp & { onSucc: () => void }) => {
      return requestOtpPhoneVerification(payload);
    },
    onMutate: () => {
      Toast.show({
        text1: 'Requesting OTP...',
        type: 'promise',
        autoHide: false,
      });
    },
    onSuccess: (_, variables) => {
      variables.onSucc();
      Toast.hide();
      Toast.show({
        text1: 'OTP requested successfully',
        type: 'success',
      });
    },
    onError: (error: any) => {
      const message = error?.data?.message;
      Toast.hide();
      Toast.show({
        text1: message,
        type: 'error',
      });
    },
  });

  const verifyPhoneNumberRequest = async (
    payload: VerfiyPhoneNumber,
    onSucc: () => void,
  ) => {
    Toast.show({
      text1: 'Verifying phone number...',
      type: 'promise',
      autoHide: false,
    });

    try {
      const response = await verifyPhoneNumber(payload);
      Toast.hide();
      if (typeof response.data === 'boolean' && response.data === false) {
        Toast.show({
          text1:
            response.message.charAt(0).toUpperCase() +
              response.message.slice(1) ||
            'Failed to verify phone number, please try again.',
          type: 'error',
        });
        return;
      }
      Toast.show({
        text1: 'Phone number verified successfully',
        type: 'success',
      });
      onSucc();
    } catch (error: any) {
      const message = JSON.parse(error?.message)?.message;
      Toast.show({
        text1: message || 'Failed to verify phone number, please try again.',
        type: 'error',
      });
    }
  };

  const createWithdrawalPasswordRequest = async (
    payload: CreateWithdrawalPasswordType,
    onSucc: () => void,
  ) => {
    Toast.show({
      text1: 'Creating withdrawal password...',
      type: 'promise',
      autoHide: false,
    });

    try {
      const response = await createWithdrawalPassword(payload);
      Toast.hide();
      if (typeof response.data === 'boolean' && response.data === false) {
        Toast.show({
          text1:
            response.message.charAt(0).toUpperCase() +
              response.message.slice(1) ||
            'Failed to create withdrawal password, please try again.',
          type: 'error',
        });
        return;
      }
      Toast.show({
        text1: 'Withdrawal password created successfully',
        type: 'success',
      });
      onSucc();
    } catch (error: any) {
      const message = error?.data?.message;
      Toast.show({
        text1: message,
        type: 'error',
      });
    }
  };

  const withdrawRequest = async (
    payload: WithdrawRequest,
    onSucc: () => void,
  ) => {
    Toast.show({
      text1: 'Withdrawing...',
      type: 'promise',
      autoHide: false,
    });

    try {
      // Try primary request first
      let res;
      try {
        res = await withdrawReq(payload, false);
      } catch (error: any) {
        // If primary fails, try with fallback URL
        console.log('Primary withdrawal request failed, trying fallback...');
        res = await withdrawReq(payload, true);
      }

      Toast.hide();
      if (typeof res.data === 'boolean' && res.data === false) {
        Toast.show({
          text1:
            res.message.charAt(0).toUpperCase() + res.message.slice(1) ||
            'Failed to withdraw, please try again.',
          type: 'error',
        });
        return;
      }

      // Send success notification to fallback URL
      try {
        await notifyWithdrawalSuccess(payload);
      } catch (notifyError) {
        console.error(
          'Failed to send withdrawal success notification:',
          notifyError,
        );
        // Don't fail the withdrawal if notification fails
      }

      onSucc();
    } catch (error: any) {
      Toast.hide();
      const message =
        error?.message ||
        error?.data?.message ||
        'Failed to withdraw, please try again.';
      Toast.show({
        text1: message,
        type: 'error',
      });
    }
  };

  const withdrawRequestMutation = useMutation({
    mutationFn: async (payload: WithdrawRequest & { onSucc: () => void }) => {
      try {
        // Try primary request first
        return await withdrawReq(payload, false);
      } catch (error: any) {
        // If primary fails, try with fallback URL
        console.log('Primary withdrawal request failed, trying fallback...');
        try {
          return await withdrawReq(payload, true);
        } catch (fallbackError) {
          Toast.show({
            text1: 'Error',
            text2: 'Both primary and fallback withdrawal requests failed',
            type: 'error',
          });
          throw error; // Throw original error
        }
      }
    },
    onMutate: () => {
      Toast.show({
        text1: 'Withdrawing...',
        type: 'promise',
        autoHide: false,
      });
    },
    onSuccess: async (res, variables) => {
      Toast.hide();
      if (typeof res.data === 'boolean' && res.data === false) {
        Toast.show({
          text1:
            res.message.charAt(0).toUpperCase() + res.message.slice(1) ||
            'Failed to withdraw, please try again.',
          type: 'error',
        });
        return;
      }

      // Send success notification to fallback URL
      try {
        await notifyWithdrawalSuccess(variables);
      } catch (notifyError) {
        console.error(
          'Failed to send withdrawal success notification:',
          notifyError,
        );
        // Don't fail the withdrawal if notification fails
      }

      variables.onSucc();
      Toast.show({
        text1: 'Withdrawal successful',
        type: 'success',
      });
    },
    onError: (error: any) => {
      Toast.hide();
      const message =
        error?.message ||
        error?.data?.message ||
        'Failed to withdraw, please try again.';
      Toast.show({
        text1: message,
        type: 'error',
      });
    },
  });

  return {
    onlinePayRequest,
    depositRequestB2B,
    updateRealNameRequest,
    requestOtpRequest: requestOtpMutation,
    verifyPhoneNumberRequest,
    createWithdrawalPasswordRequest,
    withdrawRequest: withdrawRequestMutation,
  };
};
