import type { RequestOtp, VerifyEmailType } from '../types/player';
import type { VerfiyPhoneNumber } from '../types/player';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import type { IBaseResponse } from '../types/api';
import { apiRequest } from '../services/api.config';

export const useVerify = () => {
  const { mutateAsync: requestOtpPhone, isPending: isPendingPhone } =
    useMutation({
      mutationKey: ['PhoneVerifyRequestPrefilledNumber'],
      mutationFn: async (payload: RequestOtp) =>
        apiRequest.post<IBaseResponse<boolean>>({
          path: '/Player/PhoneVerifyRequestPrefilledNumber',
          body: payload,
        }),
    });
    

  const { mutateAsync: verifyPhone, isPending: isPendingVerifyPhone } =
    useMutation({
      mutationKey: ['PhoneVerifyValidate'],
      mutationFn: async (payload: VerfiyPhoneNumber) =>
        apiRequest.post<IBaseResponse<boolean>>({
          path: '/Player/PhoneVerifyValidate',
          body: payload,
        }),
    });

  const { mutateAsync: requestOtpEmail, isPending: isPendingEmail } =
    useMutation({
      mutationKey: ['EmailVerifyRequest'],
      mutationFn: async (payload: VerifyEmailType) =>
        apiRequest.post<IBaseResponse<boolean>>({
          path: '/Player/EmailVerifyRequest',
          body: payload,
        }),
    });

  const { mutateAsync: verifyEmail, isPending: isPendingVerifyEmail } =
    useMutation({
      mutationKey: ['EmailVerifyValidate'],
      mutationFn: async (payload: VerfiyPhoneNumber) =>
        apiRequest.post<IBaseResponse<boolean>>({
          path: '/Player/EmailVerifyValidate',
          body: payload,
        }),
    });

  const getOtpEmail = async (payload: VerifyEmailType, onSucc: () => void) => {
    Toast.show({ type: 'promise', text1: 'Requesting OTP...' });
    try {
      const data = await requestOtpEmail(payload);
      if (data.message.split(' ')[0] === 'Resend') {
        Toast.show({ type: 'error', text1: data.message });
        return;
      }
      if (typeof data.data === 'boolean' && data.data === false) {
        Toast.show({
          type: 'error',
          text1: data.message.charAt(0).toUpperCase() + data.message.slice(1),
        });
        return;
      }
      onSucc();
      Toast.show({ type: 'success', text1: 'OTP requested successfully' });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to request OTP, please try again.',
      });
    }
  };

  const getOtpPhone = async (payload: RequestOtp, onSucc: () => void) => {
    Toast.show({
      type: 'promise',
      text1: 'Requesting OTP...',
      autoHide: false,
    });
    try {
      const data = await requestOtpPhone(payload);
      Toast.hide();
      if (data.message.split(' ')[0] === 'Resend') {
        // Toast.show({ type: 'error', text1: data.message });
        onSucc();

        return;
      }
      if (typeof data.data === 'boolean' && data.data === false) {
        Toast.show({
          type: 'error',
          text1: data.message.charAt(0).toUpperCase() + data.message.slice(1),
        });
        return;
      }
      onSucc();
      Toast.show({ type: 'success', text1: 'OTP requested successfully' });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to request OTP, please try again.',
      });
    }
  };

  const getOtpPhoneWithNumber = async (payload: RequestOtp, onSucc: () => void) => {
    Toast.show({ type: 'promise', text1: 'Requesting OTP...' });
    try {
      const data = await apiRequest.post<IBaseResponse<boolean>>({
        path: '/Player/PhoneVerifyRequestWithNumber',
        body: payload,
      });
      
      // Check if the response code indicates failure
      if (data.code === 0) {
        Toast.show({
          type: 'error',
          text1: data.message.charAt(0).toUpperCase() + data.message.slice(1),
        });
        return;
      }
      
      // Check if the response code indicates success
      if (data.code !== 1) {
        Toast.show({
          type: 'error',
          text1: 'Unexpected response from server',
        });
        return;
      }
      
      if (data.message.split(" ")[0] === "Resend") {
        Toast.show({ type: 'error', text1: data.message });
        return;
      }
      if (typeof data.data === "boolean" && data.data === false) {
        Toast.show({
          type: 'error',
          text1: data.message.charAt(0).toUpperCase() + data.message.slice(1),
        });
        return;
      }
      onSucc();
      Toast.show({ type: 'success', text1: 'OTP requested successfully' });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to request OTP, please try again.',
      });
    }
  };

  const verifyPhoneNumber = async (
    payload: VerfiyPhoneNumber,
    onSucc: () => void,
  ) => {
    Toast.show({
      type: 'promise',
      text1: 'Verifying phone number...',
      autoHide: false,
    });
    try {
      const data = await verifyPhone(payload);
      Toast.hide();
      if (typeof data.data === 'boolean' && data.data === false) {
        Toast.show({
          type: 'error',
          text1: data.message.charAt(0).toUpperCase() + data.message.slice(1),
        });
        return;
      }
      onSucc();
      Toast.show({
        type: 'success',
        text1: 'Phone number verified successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to verify phone number, please try again.',
      });
    }
  };

  const verifyUserEmail = async (
    payload: VerfiyPhoneNumber,
    onSucc: () => void,
  ) => {
    Toast.show({
      type: 'promise',
      text1: 'Verifying email...',
      autoHide: false,
    });
    try {
      const data = await verifyEmail(payload);
      Toast.hide();
      if (typeof data.data === 'boolean' && data.data === false) {
        Toast.show({
          type: 'error',
          text1: data.message.charAt(0).toUpperCase() + data.message.slice(1),
        });
        return;
      }
      onSucc();
      Toast.show({ type: 'success', text1: 'Email verified successfully' });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to verify email, please try again.',
      });
    }
  };

  const { mutateAsync: addNewPhoneRequest, isPending: isPendingAddNewPhone } =
    useMutation({
      mutationKey: ['AddNewPhoneNumber'],
      mutationFn: async (payload: RequestOtp) =>
        apiRequest.post<IBaseResponse<boolean>>({
          path: '/Player/PhoneVerifyRequestWithNumber',
          body: payload,
        }),
    });

  const addNewPhone = async (payload: RequestOtp, onSucc: () => void) => {
    Toast.show({
      type: 'promise',
      text1: 'Requesting OTP...',
      autoHide: false,
    });
    try {
      const data = await addNewPhoneRequest(payload);
      Toast.hide();
      if (data.message.split(' ')[0] === 'Resend') {
        // Toast.show({ type: 'error', text1: data.message });
        onSucc();
        return;
      }
      if (typeof data.data === 'boolean' && data.data === false) {
        Toast.show({
          type: 'error',
          text1: data.message.charAt(0).toUpperCase() + data.message.slice(1),
        });
        return;
      }
      onSucc();
      Toast.show({ type: 'success', text1: 'OTP requested successfully' });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to request OTP, please try again.',
      });
    }
  };
  return {
    getOtpPhone,
    getOtpPhoneWithNumber,
    getOtpEmail,
    verifyPhoneNumber,
    verifyUserEmail,
    addNewPhone,
    loadingState: {
      isPendingPhone,
      isPendingEmail,
      isPendingVerifyPhone,
      isPendingVerifyEmail,
      isPendingAddNewPhone,
    },
  };
};
