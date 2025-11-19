import type { IStatusData } from '../types/kyc';

// Import KYC assets
const cardImage = require('../assets/kyc/card.png');
const cardSuccessImage = require('../assets/kyc/card-success.png');
const cardPendingImage = require('../assets/kyc/card-pending.png');
const fullyVerifiedImage = require('../assets/kyc/fully-verified.png');
const sampleIdImage = require('../assets/kyc/sample_id.png');
const sampleBankImage = require('../assets/kyc/sample_bank.png');

export const getUploadTitle = (
  type: 'ID' | 'BANK',
  status: string | undefined,
  t: (key: string) => string,
) => {
  const messages = {
    ID: {
      DECLINE: t('kyc.upload-id-title.decline'),
      APPROVE: t('kyc.upload-id-title.approve'),
      PENDING: t('kyc.upload-id-title.pending'),
      default: t('kyc.upload-id-title.default'),
    },
    BANK: {
      DECLINE: t('kyc.upload-bank-title.decline'),
      APPROVE: t('kyc.upload-bank-title.approve'),
      PENDING: t('kyc.upload-bank-title.pending'),
      default: t('kyc.upload-bank-title.default'),
    },
  };

  return (
    messages[type][status as keyof (typeof messages)[typeof type]] ||
    messages[type].default
  );
};

export const DEFAULT_IMAGE: number = cardImage;
export const STATUS_IMAGES: {
  readonly APPROVE: number;
  readonly PENDING: number;
} = {
  APPROVE: cardSuccessImage,
  PENDING: cardPendingImage,
} as const;

export const getStatusData = (
  t: (key: string) => string,
  type: 'PENDING' | 'APPROVE',
): IStatusData => {
  const data = {
    PENDING: {
      title: t('kyc.pending.title'),
      image: cardPendingImage,
      description: t('kyc.pending.descpription'),
    },
    APPROVE: {
      title: t('kyc.approve.title'),
      image: fullyVerifiedImage,
      description: t('kyc.approve.description'),
    },
  };

  return data[type];
};

export const getButtonText = (
  status: string | undefined,
  t: (key: string) => string,
) => {
  switch (status) {
    case 'PENDING':
      return t('kyc.button-text.pending');
    case 'DECLINE':
      return t('kyc.button-text.decline');
    case 'APPROVE':
      return t('kyc.button-text.approve');
    default:
      return t('kyc.button-text.default');
  }
};

export const getDialogHelper = (
  t: (key: string) => string,
): {
  ID: { title: string; image: number };
  BANK: { title: string; image: number };
} => {
  return {
    ID: {
      title: t('kyc.dialog-helper-id'),
      image: sampleIdImage,
    },
    BANK: {
      title: t('kyc.dialog-helper-bank'),
      image: sampleBankImage,
    },
  };
};
