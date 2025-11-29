import type { SvgProps } from 'react-native-svg';
import FastUpiIcon from '../assets/dep-with/fast-upi.svg';
import SharkIcon from '../assets/dep-with/shark.svg';
import UsdtIcon from '../assets/dep-with/t.svg';
import EasyIcon from '../assets/dep-with/easy-paisa.svg';
import JazzIcon from '../assets/dep-with/jazz.svg';
export const staticData = (
  tutorial:
    | 'fastPay'
    | 'eWallet'
    | 'bankTransfer'
    | 'crypto'
    | 'withdraw'
    | 'easyPay',
  t: (key: string, options?: { returnObjects?: boolean }) => string | string[],
): {
  tutorial: string[];
  title: string;
} => {
  const fastPayTutorial = t('deposit-withdraw.tutorial.fast-pay.instructions', {
    returnObjects: true,
  }) as string[];
  const eWalletTutorial = t('deposit-withdraw.tutorial.e-wallet.instructions', {
    returnObjects: true,
  }) as string[];
  const bankTutorial = t('deposit-withdraw.tutorial.bank.instructions', {
    returnObjects: true,
  }) as string[];
  const cryptoTutorial = t('deposit-withdraw.tutorial.crypto.instructions', {
    returnObjects: true,
  }) as string[];
  const withdrawTutorial = t(
    'deposit-withdraw.tutorial.withdraw.instructions',
    {
      returnObjects: true,
    },
  ) as string[];

  if (tutorial === 'fastPay') {
    return {
      tutorial: fastPayTutorial,
      title: t('deposit-withdraw.tutorial.fast-pay.title') as string,
    };
  }

  if (tutorial === 'eWallet' || tutorial === 'easyPay') {
    return {
      tutorial: eWalletTutorial,
      title: t('deposit-withdraw.tutorial.e-wallet.title') as string,
    };
  }

  if (tutorial === 'bankTransfer') {
    return {
      tutorial: bankTutorial,
      title: t('deposit-withdraw.tutorial.bank.title') as string,
    };
  }

  if (tutorial === 'crypto') {
    return {
      tutorial: cryptoTutorial,
      title: t('deposit-withdraw.tutorial.crypto.title') as string,
    };
  }

  if (tutorial === 'withdraw') {
    return {
      tutorial: withdrawTutorial,
      title: t('deposit-withdraw.tutorial.withdraw.title') as string,
    };
  }

  return {
    tutorial: [],
    title: '',
  };
};

export const channelIdentifier = (
  channel: string[] | null,
): React.FC<SvgProps> => {
  if (!channel) return UsdtIcon;
  
  // Check for USDT/Crypto
  if (channel.some(c => c.toUpperCase().includes('USDT') || c.toUpperCase().includes('CRYPTO'))) {
    return UsdtIcon;
  }
  
  // Check for Easypaisa
  if (channel.some(c => c.toUpperCase().includes('EASYPAISA') || c.toUpperCase().includes('EASY'))) {
    return EasyIcon;
  }
  
  // Check for Jazzcash
  if (channel.some(c => c.toUpperCase().includes('JAZZCASH') || c.toUpperCase().includes('JAZZ'))) {
    return JazzIcon;
  }
  
  const sortedKey = [...channel].sort().join('+');
  switch (sortedKey) {
    case 'UPI':
      return FastUpiIcon;
    case 'Shark':
      return SharkIcon;
    case 'USDT':
      return UsdtIcon;
    case 'GOOGLE+PAYTM+PHONEPE+UPI':
      return SharkIcon;
    default:
      return UsdtIcon;
  }
};

export const CANT_USE_IFRAME_CHANNELS = ['TY_UPI'];
