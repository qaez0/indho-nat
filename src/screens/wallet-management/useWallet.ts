import Toast from 'react-native-toast-message';
import { useMutation } from '@tanstack/react-query';
import type { BankType, UsdtType, EWalletType } from '../../types/wallet';
import { addBankAccount, addUSDTWallet } from '../../services/dep-with.service';
import { useUser } from '../../hooks/useUser';

export const useWallet = () => {
  const { invalidate } = useUser();

  const { mutateAsync: addBank } = useMutation({
    mutationKey: ['wallet', 'add-bank'],
    mutationFn: async (payload: Omit<BankType, 'ifsc'>) => {
      const response = await addBankAccount(payload as BankType);
      return response;
    },
  });

  const { mutateAsync: addEWallet } = useMutation({
    mutationKey: ['wallet', 'add-ewallet'],
    mutationFn: async (payload: EWalletType) => {
      const response = await addBankAccount(payload as BankType);
      return response;
    },
  });

  const { mutateAsync: addUsdt } = useMutation({
    mutationKey: ['wallet', 'add-usdt'],
    mutationFn: async (payload: UsdtType) => {
      const response = await addUSDTWallet(payload);
      return response;
    },
  });

  const addBankRequest = async (
    payload: Omit<BankType, 'ifsc'>,
    validBanks?: string[],
    onSucc?: () => void,
  ) => {
    // Validate bank name against valid banks list before API call
    if (validBanks && validBanks.length > 0) {
      if (!validBanks.includes(payload.bank_name)) {
        Toast.show({
          type: 'error',
          text1: 'Invalid bank name. Please select a valid bank from the list.',
        });
        return;
      }
    }

    Toast.show({
      type: 'promise',
      text1: 'Adding new account...',
      autoHide: false,
    });

    try {
      const data = await addBank(payload);
      if (typeof data.data === 'boolean' && data.data === false) {
        const errorMessage =
          data.message.charAt(0).toUpperCase() + data.message.slice(1);
        Toast.hide();
        Toast.show({
          type: 'error',
          text1: errorMessage,
        });
        return;
      }
      Toast.hide();
      Toast.show({
        type: 'success',
        text1: 'Bank account added successfully',
      });
      invalidate('panel-info');
      onSucc?.();
    } catch (error: any) {
      Toast.hide();
      Toast.show({
        type: 'error',
        text1: error?.message ?? 'Failed to add bank account',
      });
    }
  };

  const addEWalletRequest = async (
    payload: EWalletType,
    validEWallets?: string[],
    onSucc?: () => void,
  ) => {
    // Validate e-wallet name against valid e-wallets list before API call
    if (validEWallets && validEWallets.length > 0) {
      if (!validEWallets.includes(payload.bank_name)) {
        Toast.show({
          type: 'error',
          text1:
            'Invalid e-wallet name. Please select a valid e-wallet from the list.',
        });
        return;
      }
    }

    Toast.show({
      type: 'promise',
      text1: 'Adding new account...',
      autoHide: false,
    });

    try {
      const data = await addEWallet(payload);
      if (typeof data.data === 'boolean' && data.data === false) {
        const errorMessage =
          data.message.charAt(0).toUpperCase() + data.message.slice(1);
        Toast.hide();
        Toast.show({
          type: 'error',
          text1: errorMessage,
        });
        return;
      }
      Toast.hide();
      Toast.show({
        type: 'success',
        text1: 'E-Wallet account added successfully',
      });
      invalidate('panel-info');
      onSucc?.();
    } catch (error: any) {
      Toast.hide();
      Toast.show({
        type: 'error',
        text1: error?.message ?? 'Failed to add E-Wallet account',
      });
    }
  };

  const addUsdtRequest = async (payload: UsdtType, onSucc: () => void) => {
    Toast.show({
      type: 'promise',
      text1: 'Adding new account...',
      autoHide: false,
    });

    try {
      const data = await addUsdt(payload);
      if (typeof data.data === 'boolean' && data.data === false) {
        const errorMessage =
          data.message.charAt(0).toUpperCase() + data.message.slice(1);
        Toast.hide();
        Toast.show({
          type: 'error',
          text1: errorMessage,
        });
        return;
      }
      Toast.hide();
      Toast.show({
        type: 'success',
        text1: 'USDT account added successfully',
      });
      invalidate('panel-info');
      onSucc();
    } catch (error: any) {
      Toast.hide();
      Toast.show({
        type: 'error',
        text1: error?.message ?? 'Failed to add USDT account',
      });
    }
  };

  return {
    addBankRequest,
    addEWalletRequest,
    addUsdtRequest,
  };
};
