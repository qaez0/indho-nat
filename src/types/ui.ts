import type { ReactNode } from 'react';
import { InputProps } from '@ui-kitten/components';
import { RootStackParamList, TabsParamList } from './nav';
import { ISlot } from './slot';

export interface IOtpSettings {
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  label?: string;
  secondsLeft: number;
  isRunning: boolean;
}
export interface IFormField extends InputProps {
  otpSettings?: IOtpSettings;
  name: string;
  menuItems?: string[];
}

export interface IFormConfig {
  title: string;
  fields: IFormField[];
  buttonText: string;
  form_id: string;
}

export interface IModalItems {
  [key: string]: IFormConfig;
}

export interface QuitGameDialogConfig {
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
}
export interface QuitGameDialogState {
  open: boolean;
  openDialog: (config: QuitGameDialogConfig) => void;
  closeDialog: () => void;
  config: QuitGameDialogConfig | null;
}

export interface IStoreGameDisplay {
  data: ISlot | undefined;
  last_used_game:
    | {
        data: ISlot | undefined;
        date: Date;
      }
    | undefined;
  deposit_gateway?: string;
  game_url?: string | undefined;
  from: string;
  setGameUrl: (data: ISlot & { game_url: string }) => void;
  setDepositGateway: (deposit_gateway: string | undefined) => void;
  setFrom: (from: string) => void;
  resetGameDisplay: () => void;
}

export interface ILastUsedGame {
  url: string;
  date: Date;
}

export interface IBaseDialogState {
  open: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export interface IBasicConfig {
  title?: string | ReactNode;
  content: ReactNode;
  actions?: {
    primary?: {
      text: string;
      onClick?: () => void;
    };
    secondary?: {
      text: string;
      onClick?: () => void;
    };
  };
}

export interface IBasicDialog {
  isOpen: boolean;
  config: IBasicConfig | null;
  // props?: Omit<DialogProps, "open">;
  // openDialog: (config: IBasicConfig, props?: Omit<DialogProps, 'open'>) => void;
  closeDialog: () => void;
}

export interface InstallPromptProps {
  installPromptVisible: boolean;
  openInstallPrompt: () => void;
  closeInstallPrompt: () => void;
}

export interface IPopUp {
  isOpen: boolean;
  openPopUp: () => void;
  closePopUp: () => void;
  reset: () => void;
  lastShown: Date | null;
}
export interface IPopUpData {
  title: string;
  image: string;
  id: string;
}

export interface IGlobalLoader {
  isOpen: boolean;
  message: string;
  openLoader: (message?: string) => void;
  closeLoader: () => void;
}

export interface IWebInfoData {
  banks: string[];
  ewallet: string[];
}

export interface ILiveChat {
  liveChatButtonVisibility: boolean;
  liveChatModalVisibility: boolean;
  toggleLiveChatButtonVisibility: () => void;
  toggleLiveChatModalVisibility: () => void;
}

export interface ICurrentRoute {
  currentRoute: keyof RootStackParamList | keyof TabsParamList | undefined;
  setCurrentRoute: (route: keyof RootStackParamList | keyof TabsParamList | undefined) => void;
}

export interface IDrawerState {
  drawerState: boolean;
  setDrawerState: (state: boolean) => void;
}

export interface ICustomDrawerState {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export interface ITopNavTitle {
  title: string | undefined;
  setTitle: (title: string | undefined) => void;
}

export interface ICarousel {
  id: number;
  image: string | number;
  nav: keyof TabsParamList | keyof RootStackParamList | string;
  key?: string;
}
