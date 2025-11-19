import Toast from 'react-native-toast-message';
import { useMutation } from '@tanstack/react-query';
import type { BankType, UsdtType } from '../../types/wallet';
import { addBankAccount, addUSDTWallet } from '../../services/dep-with.service';
import { useUser } from '../../hooks/useUser';

export const useWallet = () => {
  const { invalidate } = useUser();

  const { mutate: addBankRequest, isPending: isAddingBank } = useMutation({
    mutationKey: ['wallet', 'add-bank'],
    mutationFn: async (payload: BankType) => {
      Toast.show({
        type: 'promise',
        text1: 'Adding bank account...',
        autoHide: false,
      });
      const response = await addBankAccount(payload);
      if (typeof response?.data === 'boolean' && response?.data === false) {
        throw new Error(response?.message);
      }
      return response;
    },
    onSuccess: () => {
      Toast.hide();
      Toast.show({ type: 'success', text1: 'Bank account added successfully' });
      invalidate('panel-info');
    },
    onError: (error: any) => {
      Toast.hide();
      Toast.show({
        type: 'error',
        text1: error?.message ?? 'Failed to add bank account',
      });
    },
  });

  const { mutate: addEWalletRequest, isPending: isAddingEWallet } = useMutation({
    mutationKey: ['wallet', 'add-ewallet'],
    mutationFn: async (payload: BankType) => {
      Toast.show({
        type: 'promise',
        text1: 'Adding e-wallet...',
        autoHide: false,
      });
      const response = await addBankAccount(payload);
      if (typeof response?.data === 'boolean' && response?.data === false) {
        throw new Error(response?.message);
      }
      return response;
    },
    onSuccess: () => {
      Toast.hide();
      Toast.show({ type: 'success', text1: 'E-wallet added successfully' });
      invalidate('panel-info');
    },
    onError: (error: any) => {
      Toast.hide();
      Toast.show({
        type: 'error',
        text1: error?.message ?? 'Failed to add e-wallet',
      });
    },
  });

  const { mutate: addUsdtRequest, isPending: isAddingUsdt } = useMutation({
    mutationKey: ['wallet', 'add-usdt'],
    mutationFn: async (payload: UsdtType) => {
      Toast.show({ type: 'promise', text1: 'Adding USDT account...' });
      const response = await addUSDTWallet(payload);
      if (typeof response?.data === 'boolean' && response?.data === false) {
        throw new Error(response?.message);
      }
      return response;
    },
    onSuccess: () => {
      Toast.show({ type: 'success', text1: 'USDT account added successfully' });
      invalidate('panel-info');
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.message ?? 'Failed to add USDT account',
      });
    },
  });

  return {
    addBankRequest,
    isAddingBank,
    addEWalletRequest,
    isAddingEWallet,
    addUsdtRequest,
    isAddingUsdt,
  };
};
