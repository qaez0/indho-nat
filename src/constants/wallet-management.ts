import type { IModalItems } from '../types/ui';
import i18n from 'i18next';

export const walletManagementModalFields = (
  identifier: string,
  list?: string[],
  name?: string,
) => {
  const items: IModalItems = {
    bank: {
      title: i18n.t('wallet-management.add-bank-card'),
      buttonText: i18n.t('wallet-management.add-button'),
      form_id: 'bank',
      fields: [
        {
          label: i18n.t('wallet-management.bank-name'),
          placeholder: i18n.t('wallet-management.select-bank'),
          name: 'bank_name',
          menuItems: list,
        },
        {
          label: i18n.t('wallet-management.bank-account-number'),
          placeholder: i18n.t('wallet-management.enter-bank-account-number'),
          name: 'bank_account_num',
          maxLength: 20,
          keyboardType: 'numeric',
        },
      ],
    },
    ewallet: {
      title: i18n.t('wallet-management.add-e-wallet'),
      buttonText: i18n.t('wallet-management.add-button'),
      form_id: 'ewallet',
      fields: [
        {
          label: i18n.t('wallet-management.e-wallet-dialog.e-wallet-name'),
          placeholder: i18n.t(
            'wallet-management.e-wallet-dialog.e-wallet-name-placeholder',
          ),
          name: 'bank_name',
          menuItems: list,
        },
        {
          label: i18n.t('wallet-management.e-wallet-dialog.e-wallet-account-number'),
          placeholder: i18n.t(
            'wallet-management.e-wallet-dialog.e-wallet-account-number-placeholder',
          ),
          name: 'bank_account_num',
          maxLength: 11,
          keyboardType: 'numeric',
        },
      ],
    },
    usdt: {
      title: i18n.t('wallet-management.add-usdt-address'),
      buttonText: i18n.t('wallet-management.add-button'),
      form_id: 'usdt',
      fields: [
        {
          label: i18n.t('wallet-management.wallet-protocol'),
          name: 'wallet_protocol',
          value: 'TRC20',
          readOnly: true,
        },
        {
          label: i18n.t('wallet-management.wallet-name'),
          placeholder: i18n.t('wallet-management.enter-wallet-name'),
          name: 'wallet',
          value: name,
          readOnly: name ? true : false,
        },
        {
          label: i18n.t('wallet-management.usdt-address'),
          placeholder: i18n.t('wallet-management.enter-usdt-address'),
          name: 'usdt_address',
        },
      ],
    },
  };

  return items[identifier];
};
