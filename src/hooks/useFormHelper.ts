import { useForm } from 'react-hook-form';
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
import type { BankType, UsdtType } from '../types/wallet';
import { usdtSchema, bankSchema, eWalletSchema } from '../schemas/wallet';
import { useUser } from './useUser';
import { useVerify } from './useVerify';
import { useBottomDrawer } from './useUIHelpers';
import { useProfile } from '../screens/profile/useProfile';
import { useWallet } from '../screens/wallet-management/useWallet';

export const useFormHelper = () => {
  const { user, invalidate } = useUser();
  const { verifyPhoneNumber, verifyUserEmail } = useVerify();
  const { updateWalletPassword, updatePassword } = useProfile();
  const { addBankRequest, addUsdtRequest, addEWalletRequest } = useWallet();
  const closeDialog = useBottomDrawer(state => state.closeDialog);

  const changePassForm = useForm<ChangePasswordType>({
    resolver: yupResolver(changePasswordSchema),
  });

  const setWalletPassForm = useForm<SetWalletPasswordType>({
    resolver: yupResolver(setWalletPasswordSchema),
  });

  const verifyMobileForm = useForm<VerfiyPhoneNumber>({
    resolver: yupResolver(verfiyPhoneNumberSchema),
  });

  const verifyEmailForm = useForm<VerfiyPhoneNumber>({
    resolver: yupResolver(verfiyPhoneNumberSchema),
  });

  const bankForm = useForm<BankType>({
    resolver: yupResolver(bankSchema),
    defaultValues: {
      bank_name: '',
      bank_account_num: '',
    },
  });

  const usdtForm = useForm<UsdtType>({
    resolver: yupResolver(usdtSchema),
    defaultValues: {
      wallet: user?.player_info.real_name || '',
      usdt_address: '',
      wallet_protocol: 'TRC20',
    },
  });

  const eWalletForm = useForm<BankType>({
    resolver: yupResolver(eWalletSchema),
    defaultValues: {
      bank_name: '',
      bank_account_num: '',
      payment_method: 'EWALLET',
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
        },
      });
    },
    bank: (data: BankType) => {
      addBankRequest(data, {
        onSuccess: () => {
          invalidate('panel-info');
          closeDialog();
        },
      });
    },
    ewallet: (data: BankType) => {
      addEWalletRequest(
        { ...data, payment_method: 'EWALLET' },
        {
          onSuccess: () => {
            invalidate('panel-info');
            closeDialog();
          },
        },
      );
    },
    usdt: (data: UsdtType) => {
      addUsdtRequest(data, {
        onSuccess: () => {
          invalidate('panel-info');
          closeDialog();
        },
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
