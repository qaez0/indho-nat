import { BonusTask } from '../types/bonus';
import { imageHandler } from '../utils/image-url';

export const fakeBonuses: BonusTask[] = [
  {
    id: 100,
    title: 'Welcome Bonus',
    bonus_type: 'Register',
    reward: '10000',
    remaing_coupons: 100,
    time_remaining: 7821059,
    status: 'DISABLED',
    desc: 'Welcome Bonus',
    ios_en: 1,
    pc_en: 1,
    android_en: 1,
    h5_en: 1,
    img_link: null,
    content: '',
    start_time: '',
    end_time: '',
    misc: null,
  },
  {
    id: 101,
    title: 'Deposit Bonus',
    bonus_type: 'Deposit',
    reward: '50000',
    remaing_coupons: 100,
    time_remaining: 7821059,

    status: 'DISABLED',
    desc: 'Deposit Bonus',
    ios_en: 1,
    pc_en: 1,
    android_en: 1,
    h5_en: 1,
    img_link: imageHandler(
      '/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/bonus-avatar/public',
    ),
    content: '',
    start_time: '',
    end_time: '',
    misc: null,
  },
  {
    id: 102,
    title: 'Invite Friend Bonus',
    bonus_type: 'Invite',
    reward: '9999',
    remaing_coupons: 100,

    time_remaining: 7821059,
    status: 'DISABLED',
    desc: 'Invite Friend Bonus',
    ios_en: 1,
    pc_en: 1,
    android_en: 1,
    h5_en: 1,
    img_link: imageHandler(
      '/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/bonus-avatar/public',
    ),
    content: '',
    start_time: '',
    end_time: '',
    misc: null,
  },
];

export const bonusGradients = [
  ['#1D7D6A', '#43D4B7'],
  ['#024392', '#389DFF'],
  ['#FFB72B', '#D48943'],
  ['#4A9202', '#2A531B'],
];
