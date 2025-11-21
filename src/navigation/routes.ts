import {
  AuthParamList,
  BlogsParamList,
  GameParamList,
  MessageCenterParamList,
  RootStackParamList,
  RouteConfig,
  TabsParamList,
} from '../types/nav';
import MainTabs from './main';
import GameStack from './game';
import ProfileScreen from '../screens/profile';
import WalletManagementScreen from '../screens/wallet-management';
import VipScreen from '../screens/vip';
import KycScreen from '../screens/kyc';
import TransactionRecordScreen from '../screens/transaction-record';
import BettingRecordScreen from '../screens/betting-record';
import LockedDetailsScreen from '../screens/locked-record';
import PromotionsScreen from '../screens/promotions';
import SponsorScreen from '../screens/sponsor';
import AffiliateScreen from '../screens/affiliate';
import SlotsScreen from '../screens/slots';
import CasinoScreen from '../screens/casino';
import SportsScreen from '../screens/sports';
import BonusScreen from '../screens/bonus';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import Header from '../components/layout/Header';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home';
import DepositWithdrawScreen from '../screens/deposit-withdraw';
import WheelScreen from '../screens/wheel';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MessageCenterStack from './notification';
import MessageCenterOverviewScreen from '../screens/message-center/overview';
import MessageCenterSpecificScreen from '../screens/message-center/specific';
import LuckySpinScreen from '../screens/lucky-spin';
import InformationScreen from '../screens/information';
import GameScreen from '../screens/game/game';
import InGameDepositScreen from '../screens/game/deposit';
import BlogOverviewScreen from '../screens/blog/overview';
import SpecificBlogScreen from '../screens/blog/specific';
import BlogScreen from '../screens/blog';
import BlogStack from './blog';
import PaymentGatewayScreen from '../screens/game/gateway';
import EarnScreen from '../screens/invite';
import InviteFriendsScreen from '../screens/invite-friends';

export const RootRoutes: RouteConfig<
  keyof RootStackParamList,
  NativeStackNavigationOptions
>[] = [
  { name: 'main-tabs', component: MainTabs, options: { header: Header } },
  { name: 'game', component: GameStack, options: { headerShown: false } },
  { name: 'profile', component: ProfileScreen },
  { name: 'wallet-management', component: WalletManagementScreen },
  { name: 'vip', component: VipScreen },
  { name: 'kyc', component: KycScreen },
  { name: 'transaction-record', component: TransactionRecordScreen },
  { name: 'betting-record', component: BettingRecordScreen },
  { name: 'locked-details', component: LockedDetailsScreen },
  { name: 'bonus', component: BonusScreen },
  { name: 'blog', component: BlogStack },
  { name: 'sponsor', component: SponsorScreen },
  { name: 'lucky-spin', component: LuckySpinScreen },
  { name: 'invite-friends', component: InviteFriendsScreen },
];

export const TabRoutes: RouteConfig<
  keyof TabsParamList,
  BottomTabNavigationOptions
>[] = [
  { name: 'home', component: HomeScreen },
  { name: 'slots', component: SlotsScreen },
  { name: 'deposit-withdraw', component: DepositWithdrawScreen },
  { name: 'earn', component: EarnScreen },
  { name: 'wheel', component: WheelScreen },
  { name: 'sports', component: SportsScreen },
  { name: 'casino', component: CasinoScreen },
  { name: 'promotions', component: PromotionsScreen },
  { name: 'affiliate', component: AffiliateScreen },
  { name: 'information', component: InformationScreen },
  { name: 'message-center', component: MessageCenterStack },
  { name: 'sponsor', component: SponsorScreen },
  { name: 'bonus', component: BonusScreen },
  { name: 'profile', component: ProfileScreen },
  { name: 'wallet-management', component: WalletManagementScreen },
  { name: 'transaction-record', component: TransactionRecordScreen },
  { name: 'betting-record', component: BettingRecordScreen },
  { name: 'locked-details', component: LockedDetailsScreen },
  { name: 'vip', component: VipScreen },
  { name: 'kyc', component: KycScreen },
  { name: 'blog', component: BlogStack },
  { name: 'lucky-spin', component: LuckySpinScreen },
  { name: 'invite-friends', component: InviteFriendsScreen },
];

export const GameRoutes: RouteConfig<
  keyof GameParamList,
  NativeStackNavigationOptions
>[] = [
  { name: 'game', component: GameScreen },
  { name: 'in-game-deposit', component: InGameDepositScreen },
  { name: 'payment-gateway', component: PaymentGatewayScreen },
];

export const MessageCenterRoutes: RouteConfig<
  keyof MessageCenterParamList,
  NativeStackNavigationOptions
>[] = [
  {
    name: 'message-center-overview',
    component: MessageCenterOverviewScreen,
  },
  {
    name: 'message-center-specific',
    component: MessageCenterSpecificScreen,
  },
];

export const BlogsRoutes: RouteConfig<
  keyof BlogsParamList,
  NativeStackNavigationOptions
>[] = [
  { name: 'blogs', component: BlogScreen },
  { name: 'specific-blog', component: SpecificBlogScreen },
  { name: 'overview-blogs', component: BlogOverviewScreen },
];

export const AuthRoutes: RouteConfig<
  keyof AuthParamList,
  NativeStackNavigationOptions
>[] = [
  { name: 'login', component: LoginScreen },
  { name: 'register', component: RegisterScreen },
];

export const HIDDEN_TABS = [
  'login',
  'register',
  'casino',
  'sports',
  'promotions',
  'affiliate',
  'message-center',
  'information',
  'sponsor',
  'bonus',
  'transaction-record',
  'betting-record',
  'locked-details',
  'profile',
  'wallet-management',
  'vip',
  'kyc',
  'blog',
  'lucky-spin',
  'invite-friends',
];

export const HeaderTabs: (keyof TabsParamList)[] = [
  'home',
  'sports',
  'casino',
  'slots',
  'vip',
  'promotions',
  'affiliate',
];
