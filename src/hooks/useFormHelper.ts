import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import type {
  ChangePasswordType,
  SetWalletPasswordType,
  VerfiyPhoneNumber,
} from '../types/player';
import {
  changePasswordSchema,
  setWalletPasswordSchema,
  verfiyPhoneNumberSchema,
} from '../schemas/player';
import { yupResolver } from '@hookform/resolvers/yup';
import type { BankType, UsdtType, EWalletType } from '../types/wallet';
import {
  usdtSchema,
  createBankSchema,
  createEWalletSchema,
} from '../schemas/wallet';
import { useUser } from './useUser';
import { useVerify } from './useVerify';
import { useBottomDrawer } from './useUIHelpers';
import { useProfile } from '../screens/profile/useProfile';
import { useWallet } from '../screens/wallet-management/useWallet';
import { navigationRef } from '../utils/navigation';
import { getBasicDeviceInfo } from '../services/device.service';

export const useFormHelper = () => {
  const { user, invalidate } = useUser();
  const closeDialog = useBottomDrawer(state => state.closeDialog);
  const config = useBottomDrawer(state => state.config);
  const { verifyPhoneNumber, verifyUserEmail } = useVerify();
  const { updateWalletPassword, updatePassword } = useProfile();
  const { addBankRequest, addUsdtRequest, addEWalletRequest } = useWallet();

  const changePassForm = useForm<ChangePasswordType>({
    resolver: yupResolver(changePasswordSchema),
    mode: 'onChange', // Enable real-time validation
  });

  const setWalletPassForm = useForm<SetWalletPasswordType>({
    resolver: yupResolver(setWalletPasswordSchema),
    mode: 'onChange', // Enable real-time validation
  });

  const verifyMobileForm = useForm<VerfiyPhoneNumber>({
    resolver: yupResolver(verfiyPhoneNumberSchema),
  });

  const verifyEmailForm = useForm<VerfiyPhoneNumber>({
    resolver: yupResolver(verfiyPhoneNumberSchema),
  });

  // Get valid banks from config if available
  const validBanks = useMemo(() => {
    if (config?.form_id === 'bank') {
      const bankNameField = config.fields.find(
        field => field.name === 'bank_name',
      );
      return bankNameField?.menuItems || [];
    }
    return [];
  }, [config]);

  // Get valid e-wallets from config if available
  const validEWallets = useMemo(() => {
    if (config?.form_id === 'ewallet') {
      const eWalletNameField = config.fields.find(
        field => field.name === 'bank_name',
      );
      return eWalletNameField?.menuItems || [];
    }
    return [];
  }, [config]);

  const bankForm = useForm<Omit<BankType, 'ifsc'>>({
    resolver: yupResolver(createBankSchema(validBanks)),
    defaultValues: {
      bank_name: '',
      bank_account_num: '',
    },
  });

  // Update form resolver when validBanks changes
  useEffect(() => {
    if (config?.form_id === 'bank' && validBanks.length > 0) {
      bankForm.clearErrors();
      // Note: react-hook-form doesn't support changing resolver dynamically,
      // but the validation in submit handler will catch invalid banks
    }
  }, [validBanks, config, bankForm]);

  const eWalletForm = useForm<EWalletType>({
    resolver: yupResolver(createEWalletSchema(validEWallets)) as any,
    defaultValues: {
      bank_name: '',
      bank_account_num: '',
      payment_method: 'EWALLET',
      device: 3, // Default to H5, will be updated on submit
    },
  });

  // Update form resolver when validEWallets changes
  useEffect(() => {
    if (config?.form_id === 'ewallet' && validEWallets.length > 0) {
      eWalletForm.clearErrors();
      // Note: react-hook-form doesn't support changing resolver dynamically,
      // but the validation in submit handler will catch invalid e-wallets
    }
  }, [validEWallets, config, eWalletForm]);

  const usdtForm = useForm<UsdtType>({
    resolver: yupResolver(usdtSchema),
    defaultValues: {
      wallet: user?.player_info.real_name || '',
      usdt_address: '',
      wallet_protocol: 'TRC20',
    },
  });

  const form = {
    'change-pass': changePassForm,
    'set-wallet-pass': setWalletPassForm,
    'verify-mobile': verifyMobileForm,
    'verify-email': verifyEmailForm,
    bank: bankForm,
    ewallet: eWalletForm,
    usdt: usdtForm,
  };

  const submitForm = {
    'verify-mobile': (data: VerfiyPhoneNumber) => {
      verifyPhoneNumber(data, () => {
        invalidate('panel-info');
        closeDialog();
      });
    },
    'verify-email': (data: VerfiyPhoneNumber) => {
      verifyUserEmail(data, () => {
        invalidate('panel-info');
        closeDialog();
      });
    },
    'set-wallet-pass': (data: SetWalletPasswordType) => {
      updateWalletPassword(data, {
        onSuccess: () => {
          invalidate('panel-info');
          closeDialog();
        },
      });
    },
    'change-pass': (data: ChangePasswordType) => {
      updatePassword(data, {
        onSuccess: () => {
          invalidate('panel-info');
          closeDialog();
          // Navigate to deposit-withdraw with withdraw tab
          if (navigationRef.isReady()) {
            navigationRef.navigate('main-tabs', {
              screen: 'tabs',
              params: {
                screen: 'deposit-withdraw',
                params: { tab: 'withdraw' },
              },
            });
          }
        },
      });
    },
    bank: (data: Omit<BankType, 'ifsc'>) => {
      // Get valid banks list from config
      const bankNameField = config?.fields.find(
        field => field.name === 'bank_name',
      );
      const validBanksList = bankNameField?.menuItems || [];

      // Validation is also done in addBankRequest, but we do it here for form error display
      if (validBanksList.length > 0 && !validBanksList.includes(data.bank_name)) {
        bankForm.setError('bank_name', {
          type: 'validation',
          message: 'Please select a valid bank from the list',
        });
        return;
      }

      addBankRequest(data, validBanksList, () => {
        invalidate('panel-info');
        closeDialog();
        // Navigate to deposit-withdraw with withdraw tab
        if (navigationRef.isReady()) {
          navigationRef.navigate('main-tabs', {
            screen: 'tabs',
            params: {
              screen: 'deposit-withdraw',
              params: { tab: 'withdraw' },
            },
          });
        }
      });
    },
    ewallet: async (data: EWalletType) => {
      // Get valid e-wallets list from config
      const eWalletNameField = config?.fields.find(
        field => field.name === 'bank_name',
      );
      const validEWalletsList = eWalletNameField?.menuItems || [];

      // Validation is also done in addEWalletRequest, but we do it here for form error display
      if (
        validEWalletsList.length > 0 &&
        !validEWalletsList.includes(data.bank_name)
      ) {
        eWalletForm.setError('bank_name', {
          type: 'validation',
          message: 'Please select a valid e-wallet from the list',
        });
        return;
      }

      try {
        const deviceInfo = await getBasicDeviceInfo();
        const device = deviceInfo.enhancedDeviceInfo.deviceApiValue || 3;

        const payload: EWalletType = {
          ...data,
          device,
        };

        addEWalletRequest(payload, validEWalletsList, () => {
          invalidate('panel-info');
          closeDialog();
          // Navigate to deposit-withdraw with withdraw tab
          if (navigationRef.isReady()) {
            navigationRef.navigate('main-tabs', {
              screen: 'tabs',
              params: {
                screen: 'deposit-withdraw',
                params: { tab: 'withdraw' },
              },
            });
          }
        });
      } catch (error) {
        // Fallback to default device value if fingerprint fails
        const payload: EWalletType = {
          ...data,
          device: 3, // Default to H5
        };
        addEWalletRequest(payload, validEWalletsList, () => {
          invalidate('panel-info');
          closeDialog();
          // Navigate to deposit-withdraw with withdraw tab
          if (navigationRef.isReady()) {
            navigationRef.navigate('main-tabs', {
              screen: 'tabs',
              params: {
                screen: 'deposit-withdraw',
                params: { tab: 'withdraw' },
              },
            });
          }
        });
      }
    },
    usdt: (data: UsdtType) => {
      addUsdtRequest(data, () => {
        invalidate('panel-info');
        closeDialog();
        // Navigate to deposit-withdraw with withdraw tab
        if (navigationRef.isReady()) {
          navigationRef.navigate('main-tabs', {
            screen: 'tabs',
            params: {
              screen: 'deposit-withdraw',
              params: { tab: 'withdraw' },
            },
          });
        }
      });
    },
  };

  const getForm = (formId: keyof typeof form) => {
    return {
      form: form[formId as keyof typeof form],
      onSubmit: submitForm[formId as keyof typeof submitForm] || (() => {}),
    };
  };

  return {
    getForm,
  };
};
