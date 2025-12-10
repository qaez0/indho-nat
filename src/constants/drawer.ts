import { useLiveChat } from '../store/useUIStore';
import { RootStackParamList, TabsParamList } from '../types/nav';
import { useTranslation } from 'react-i18next';
import { queryClient } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGameDisplay } from '../store/useUIStore';
import { useLanguageStore } from '../store/useLanguageStore';
import Toast from 'react-native-toast-message';
import i18n from 'i18next';
export interface IDrawerItems {
  id: string;
  label: string;
  children?: {
    label: string;
    icon: string;
    path?: keyof RootStackParamList | keyof TabsParamList;
    onClick?: () => void;
    iconStyle?: string;
  }[];
  icon: string;
  path?: keyof RootStackParamList | keyof TabsParamList;
  onClick?: () => void;
  iconStyle?: string;
}

export const authDrawerItems = ['account-details', 'other-records', 'invite'];

const clearCache = async () => {
  try {
    // Clear React Query cache (API response cache)
    queryClient.clear();
    // Clear game display cache storage
    await AsyncStorage.removeItem('11ic-native-game-display-storage');
    useGameDisplay.getState().resetGameDisplay();

    // Clear language preference and reset to default
    await AsyncStorage.removeItem('11ic-native-language-storage');
    const defaultLanguage = {
      label: 'Pakistan',
      value: 'pk',
    };
    useLanguageStore.getState().setSelected(defaultLanguage);
    i18n.changeLanguage('pk');

    // Show success message
    // Toast.show({
    //   type: 'success',
    //   text1: 'Cache cleared successfully',
    // });
  } catch (error) {
    console.error('Failed to clear cache:', error);
    Toast.show({
      type: 'error',
      text1: 'Failed to clear cache',
      text2: 'Please try again',
    });
  }
};

export const useDrawerItems = () => {
  const { t } = useTranslation();
  const items: IDrawerItems[] = [
    {
      id: 'account-details',
      label: t('side-bar-menu.account-details.title'),
      icon: require('../assets/drawer/account_details.png'),
      children: [
        {
          label: t('side-bar-menu.account-details.my-profile'),
          icon: require('../assets/drawer/my_profile.png'),
          path: 'profile',
        },
        {
          label: t('side-bar-menu.account-details.wallet-management'),
          icon: require('../assets/drawer/wallet_manage.png'),
          path: 'wallet-management',
        },
        {
          label: t('side-bar-menu.account-details.vip-level'),
          icon: require('../assets/drawer/vip_level.png'),
          path: 'vip',
        },
        {
          label: t('side-bar-menu.account-details.kyc-verification'),
          icon: require('../assets/drawer/kyc.png'),
          path: 'kyc',
        },
      ],
    },
    {
      id: 'other-records',
      label: t('side-bar-menu.other-records.title'),
      icon: require('../assets/drawer/other_records.png'),
      children: [
        {
          label: t('side-bar-menu.other-records.transaction-record'),
          icon: require('../assets/drawer/transac_record.png'),
          path: 'transaction-record',
        },
        {
          label: t('side-bar-menu.other-records.betting-record'),
          icon: require('../assets/drawer/betting_record.png'),
          path: 'betting-record',
        },
        {
          label: t('side-bar-menu.other-records.locked-details'),
          icon: require('../assets/drawer/locked_details.png'),
          path: 'locked-details',
        },
        {
          label: t('side-bar-menu.other-records.message-center'),
          icon: require('../assets/drawer/message_center.png'),
          path: 'message-center',
        },
      ],
    },
    {
      id: 'promotions',
      label: t('common-terms.promotions'),
      icon: require('../assets/drawer/promotions.png'),
      path: 'promotions',
    },
    {
      id: 'invite',
      label: t('side-bar-menu.invite'),
      icon: require('../assets/drawer/nav-earn.png'),
      path: 'invite-friends',
    },
    {
      id: 'bonus',
      label: t('common-terms.bonus'),
      icon: require('../assets/drawer/bonus.png'),
      path: 'bonus',
    },
    {
      id: 'all-games',
      label: t('side-bar-menu.all-games.title'),
      icon: require('../assets/drawer/all_games.png'),
      children: [
        {
          label: t('common-terms.sports'),
          icon: require('../assets/drawer/sports.png'),
          path: 'sports',
        },
        {
          label: t('common-terms.casino'),
          icon: require('../assets/drawer/live_casino.png'),
          path: 'casino',
        },
        {
          label: t('common-terms.slots'),
          icon: require('../assets/drawer/slots.png'),
          path: 'slots',
        },
      ],
    },
    {
      id: 'online-betting-blog',
      label: t('content-title.online-betting-blog'),
      icon: require('../assets/drawer/blog.png'),
      path: 'blog',
    },
    {
      id: 'join-11ic-partner',
      label: t('side-bar-menu.join-11ic-partner'),
      icon: require('../assets/drawer/partner.png'),
      path: 'affiliate',
    },
    {
      id: '11ic-sponsor',
      label: t('side-bar-menu.11ic-sponsor'),
      icon: require('../assets/drawer/sponsor.png'),
      path: 'sponsor',
    },
    // {
    //   id: "c11bet-sponsor",
    //   label: "c11bet Sponsor",
    //   icon: "/images/common/drawer/sponsor.png",
    // },
    {
      id: 'lucky-spin',
      label: t('side-bar-menu.lucky-spin'),
      icon: require('../assets/drawer/lucky_spin.png'),
      path: 'wheel',
    },
    {
      id: 'lucky-envelope',
      label: t('side-bar-menu.lucky-envelope'),
      icon: require('../assets/drawer/lucky-envelope.png'),
      path: 'lucky-spin',
      iconStyle: 'side-bar-pulse-animation',
    },
    {
      id: 'clear-cache',
      label: t('side-bar-menu.clear-cache'),
      icon: require('../assets/drawer/clear_cache.png'),
      onClick: clearCache,
    },
    {
      id: 'chat-support',
      label: t('side-bar-menu.chat-support'),
      icon: require('../assets/drawer/chat_support.png'),
      onClick: () => useLiveChat.getState().toggleLiveChatModalVisibility(),
    },
  ];

  return items;
};
