import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useUser } from '../../hooks/useUser';
import type {
  ChangePasswordType,
  SetWalletPasswordType,
  UpdateProfileType,
} from '../../types/player';
import {
  createWithdrawalPassword,
  updatePassword as updatePasswordApi,
  updateWalletPassOrRealName,
} from '../../services/user.service';

export const useProfile = () => {
  const { invalidate } = useUser();

  const { mutate: updateBasicInfo, isPending: isUpdatingBasicInfo } =
    useMutation({
      mutationKey: ['profile', 'update-basic-info'],
      mutationFn: async (payload: UpdateProfileType) => {
        Toast.show({ type: 'promise', text1: 'Saving profile...' });
        const formatted = {
          ...payload,
          gender: payload.gender === 'Male' ? 1 : 2,
          birthday: (payload as any)?.birthday
            ? (() => {
                const d = new Date(payload.birthday);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}T00:00:00.000Z`;
              })()
            : (payload as any).birthday,
        };
        const response = await updateWalletPassOrRealName(formatted as any);
        return response;
      },
      onSuccess: () => {
        Toast.show({ type: 'success', text1: 'Profile updated' });
        invalidate('panel-info');
      },
      onError: (error: any) => {
        Toast.show({
          type: 'error',
          text1: error?.message ?? 'Update failed',
        });
      },
    });

  const { mutate: updatePassword, isPending: isUpdatingPassword } = useMutation(
    {
      mutationKey: ['profile', 'update-password'],
      mutationFn: async (payload: ChangePasswordType) => {
        Toast.show({ type: 'promise', text1: 'Updating password...' });
        const response = await updatePasswordApi(payload);
        if (typeof response?.data === 'boolean' && response?.data === false) {
          throw new Error(response?.message);
        }
        return response;
      },
      onSuccess: () => {
        Toast.show({ type: 'success', text1: 'Password updated' });
      },
      onError: (error: any) => {
        Toast.show({ type: 'error', text1: error?.message ?? 'Update failed' });
      },
    },
  );

  const { mutate: updateWalletPassword, isPending: isUpdatingWalletPassword } =
    useMutation({
      mutationKey: ['profile', 'update-wallet-password'],
      mutationFn: async (payload: SetWalletPasswordType) => {
        Toast.show({ type: 'promise', text1: 'Updating wallet password...' });
        const response = await createWithdrawalPassword(payload);
        if (typeof response?.data === 'boolean' && response?.data === false) {
          throw new Error(response?.message);
        }
        return response;
      },
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: 'Wallet password updated',
        });
        invalidate('panel-info');
      },
      onError: (error: any) => {
        Toast.show({ type: 'error', text1: error?.message ?? 'Update failed' });
      },
    });

  return {
    updateBasicInfo,
    isUpdatingBasicInfo,
    updatePassword,
    isUpdatingPassword,
    updateWalletPassword,
    isUpdatingWalletPassword,
  };
};
