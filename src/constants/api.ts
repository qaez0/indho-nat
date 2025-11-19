// API Configuration Constants

export const ENDPOINTS_REQUIRING_IP = [
  '/player/deposit',
  'Login',
  'Login/PhoneLogin',
  'Player/Register/PhoneOnly',
  'telegram/auth/login',
];

export const ENDPOINTS_TRIGGERING_LOGOUT_ON_401 = [
  '/Login/CheckStatus',
  '/Player/Balance',
  '/Bonus',
  '/Bonus/LuckyEnvelopeEventInfo',
  '/Bonus/LuckyEnvelopeEventSetting',
  '/Bonus/SelectLuckyEnvelope',
  '/Bonus/PlayLuckySpinEnvelope',
  '/Bonus/ClaimLuckyEnvelopeReward',
  '/Invite/InviteCashBackDetails',
  '/Bonus/TaskList',
  '/Web/WebInfo',
  '/Player/PanelInfo',
  '/Bank/DepositRequest/PreventDuplicate',
  '/Bank/DepositRequest/B2B',
  '/Player/DepositRecord',
  '/Bank/DepositRequest/Cancel',
  '/Bank/AddBankAccount',
  '/Bank/AddUSDTWallet',
];
