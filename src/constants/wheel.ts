import { RouletteData } from '../types/wheel';

const prizesList = [
  'Rs 11',
  'Rs 21',
  'Rs 31',
  'Rs 51',
  'Rs 111',
  'Rs 251',
  'Rs 777',
  'OPPO',
];

export const generateRandomUserName = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const chars = letters + numbers;
  const randomChar = chars[Math.floor(Math.random() * chars.length)];
  return `ph*****${randomChar}`;
};

export const generateRandomPrize = (isOppo = false) => {
  if (isOppo) return 'OPPO';
  return prizesList[Math.floor(Math.random() * prizesList.length)];
};

export const dummyData: RouletteData[] = [
  {
    id: 1,
    image: require('../assets/logo.svg'),
    name: '...',
    client: '',
    order: 1,
    enabled: 1,
  },
  {
    id: 2,
    image: require('../assets/logo.svg'),
    name: '...',
    client: '',
    order: 2,
    enabled: 1,
  },
  {
    id: 3,
    image: require('../assets/logo.svg'),
    name: '...',
    client: '',
    order: 3,
    enabled: 1,
  },
  {
    id: 4,
    image: require('../assets/logo.svg'),
    name: '...',
    client: '',
    order: 4,
    enabled: 1,
  },
  {
    id: 5,
    image: require('../assets/logo.svg'),
    name: '...',
    client: '',
    order: 5,
    enabled: 1,
  },
  {
    id: 6,
    image: require('../assets/logo.svg'),
    name: '...',
    client: '',
    order: 6,
    enabled: 1,
  },
  {
    id: 7,
    image: require('../assets/logo.svg'),
    name: '...',
    client: '',
    order: 7,
    enabled: 1,
  },
  {
    id: 8,
    image: require('../assets/logo.svg'),
    name: '...',
    client: '',
    order: 8,
    enabled: 1,
  },
  {
    id: 9,
    image: require('../assets/logo.svg'),
    name: '...',
    client: '',
    order: 9,
    enabled: 1,
  },
];
