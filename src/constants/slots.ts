import { ImageSourcePropType } from 'react-native';
import type { TFunction } from 'i18next';

export type optionProps = {
  value: string;
  label: string;
  image?: ImageSourcePropType;
};

export const getSlotProviderOptions = (t: TFunction): optionProps[] => [
  { 
    value: '', 
    label: t('common-terms.all').toUpperCase() 
  },
  {
    value: 'JILI',
    label: 'JILI',
    image: require('../assets/common/game-provider-logo/jili.png'),
  },
  {
    value: 'PG',
    label: 'PG',
    image: require('../assets/common/game-provider-logo/pg.png'),
  },
  {
    value: 'SPRIBE',
    label: 'SPRIBE',
    image: require('../assets/common/game-provider-logo/spribe.png'),
  },
  {
    value: 'CQ9',
    label: 'CQ9',
    image: require('../assets/common/game-provider-logo/cq9.png'),
  },
  // {
  //   value: 'EFG',
  //   label: 'EFG',
  //   image: require('../assets/common/game-provider-logo/efg.png'),
  // },
];
