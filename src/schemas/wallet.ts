import * as yup from 'yup';

export const eWalletSchema = yup.object().shape({
  bank_name: yup.string().required('E-Wallet Name is required'),
  payment_method: yup.string().optional().default('EWALLET'),
  bank_account_num: yup
    .string()
    .required('E-Wallet Account Number is required')
    .matches(/^[0-9]+$/, 'Must be only digits')
    .matches(/^\S*$/, 'E-Wallet Account Number cannot contain spaces')
    .length(11, 'Account number must be exactly 11 digits'),
});

export const createEWalletSchema = (validEWallets: string[] = []) => {
  return yup.object().shape({
    bank_name: yup
      .string()
      .required('E-Wallet Name is required')
      .test('valid-ewallet', 'Please select a valid e-wallet from the list', value => {
        if (validEWallets.length === 0) return true; // If no list provided, allow any
        return validEWallets.includes(value || '');
      }),
    payment_method: yup.string().optional().default('EWALLET'),
    bank_account_num: yup
      .string()
      .required('E-Wallet Account Number is required')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .matches(/^\S*$/, 'E-Wallet Account Number cannot contain spaces')
      .length(11, 'Account number must be exactly 11 digits'),
    device: yup.number().notRequired(),
  });
};

export const bankSchema = yup.object().shape({
  bank_name: yup.string().required('Bank Name is required'),
  payment_method: yup.string().optional().default('BANK'),
  bank_account_num: yup
    .string()
    .required('Bank Account Number is required')
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(8, 'Account number must be at least 8 digits')
    .max(20, 'Account number must be at most 20 digits')
    .matches(/^\S*$/, 'Bank Account Number cannot contain spaces'),
});

export const createBankSchema = (validBanks: string[] = []) => {
  return yup.object().shape({
    bank_name: yup
      .string()
      .required('Bank Name is required')
      .test('valid-bank', 'Please select a valid bank from the list', value => {
        if (validBanks.length === 0) return true; // If no list provided, allow any
        return validBanks.includes(value || '');
      }),
    payment_method: yup.string().optional().default('BANK'),
    bank_account_num: yup
      .string()
      .required('Bank Account Number is required')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(8, 'Account number must be at least 8 digits')
      .max(20, 'Account number must be at most 20 digits')
      .matches(/^\S*$/, 'Bank Account Number cannot contain spaces'),
  });
};

export const usdtSchema = yup.object().shape({
  wallet_protocol: yup.string().optional().default('TRC20'),
  wallet: yup.string().required('Wallet Name is required'),
  usdt_address: yup
    .string()
    .required('USDT Address is required')
    .matches(/^[a-zA-Z0-9]+$/, 'No special characters allowed')
    .min(34, 'Wallet Address must be exactly 34 characters')
    .max(34, 'Wallet Address must be exactly 34 characters')
    .test('starts-with-t', "Wallet Address must start with 'T'", value => {
      return value?.startsWith('T') ?? false;
    }),
});
