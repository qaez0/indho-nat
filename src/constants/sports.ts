import { ImageSourcePropType } from 'react-native';
import type { TFunction } from 'i18next';

export type SportsOption = {
  id: string;
  title: string;
  icon?: ImageSourcePropType;
};

export const getSportsMenu = (t: TFunction): SportsOption[] => [
  { 
    id: 'all', 
    title: t('common-terms.all').toUpperCase()
   },
  // {
  //   id: 'saba',
  //   title: 'Saba',
  //   icon: require('../assets/common/game-provider-logo/saba.png'),
  // },
  {
    id: '9w',
    title: '9 Wicket',
    icon: require('../assets/common/game-provider-logo/9wicket.png'),
  },
];
