import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IMessageRecordItem } from './message';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  auth: NavigatorScreenParams<AuthParamList>;
  game: undefined;
  profile: undefined;
  vip: undefined;
  kyc: undefined;
  bonus: undefined;
  blog: NavigatorScreenParams<BlogsParamList>;
  sponsor: undefined;
  'main-tabs': NavigatorScreenParams<DrawerParamList>;
  'wallet-management': undefined;
  'transaction-record': undefined;
  'betting-record': undefined;
  'locked-details': undefined;
  'lucky-spin': undefined;
  'deposit-withdraw': { tab?: 'deposit' | 'withdraw' };
  'invite-friends': undefined;
};

export type TabsParamList = {
  home: undefined;
  sports: { from?: string };
  casino: undefined;
  slots: { game_id?: string };
  wheel: undefined;
  promotions: undefined;
  affiliate: undefined;
  sponsor: undefined;
  bonus: undefined;
  profile: undefined;
  'lucky-spin': undefined;
  'invite-friends': undefined;
  vip: undefined;
  kyc: undefined;
  blog: undefined;
  'wallet-management': undefined;
  'locked-details': undefined;
   'betting-record': undefined;
  'transaction-record': undefined;
  'deposit-withdraw': { tab?: 'deposit' | 'withdraw' };
  earn: undefined;
  information: { tab?: 'about' | 'faq' | 'privacy' | 'terms' | 'affiliate' };
  // login: undefined;
  // register: {
  //   invite_code?: string;
  // };
  'message-center': {
    screen: 'message-center-overview' | 'message-center-specific';
    detail?: Partial<IMessageRecordItem>;
  };
};

export type DrawerParamList = {
  tabs: NavigatorScreenParams<TabsParamList>;
  auth: NavigatorScreenParams<AuthParamList & TabsParamList>;
};

export type GameParamList = {
  game: undefined;
  'in-game-deposit': undefined;
  'payment-gateway': undefined;
};

export type AuthParamList = {
  login: undefined;
  register: {
    invite_code?: string;
  }
};

export type MessageCenterParamList = {
  'message-center-overview': undefined;
  'message-center-specific': { detail: Partial<IMessageRecordItem> };
};

export type BlogsParamList = {
  blogs: undefined;
  'specific-blog': {
    articleId: string;
  };
  'overview-blogs': {
    category: string;
  };
};

export type RouteConfig<K, T> = {
  name: K;
  component: React.ComponentType<any>;
  options?: T;
};

export type RootStackNav = NativeStackNavigationProp<RootStackParamList>;
export type TabNav = BottomTabNavigationProp<TabsParamList>;
export type GameNav = NativeStackNavigationProp<GameParamList>;
export type BlogNav = NativeStackNavigationProp<BlogsParamList>;
export type DrawerNav = NativeStackNavigationProp<DrawerParamList>;
