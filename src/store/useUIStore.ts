import { create } from 'zustand';
import {
  ICurrentRoute,
  ICustomDrawerState,
  IDrawerState,
  IGlobalLoader,
  ILiveChat,
  IStoreGameDisplay,
  ITopNavTitle,
} from '../types/ui';
import { RootStackParamList, TabsParamList } from '../types/nav';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';

interface AuthModalState {
  open: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useAuthModal = create<AuthModalState>(set => ({
  open: false,
  openDialog: () => set({ open: true }),
  closeDialog: () => set({ open: false }),
}));

export const useGlobalLoader = create<IGlobalLoader>(set => ({
  isOpen: false,
  message: i18n.t('common-terms.please-wait'),
  openLoader: message => set({ isOpen: true, message }),
  closeLoader: () => set({ isOpen: false, message: i18n.t('common-terms.please-wait') }),
}));

export const useLiveChat = create<ILiveChat>(set => ({
  liveChatButtonVisibility: true,
  liveChatModalVisibility: false,
  toggleLiveChatButtonVisibility: () =>
    set(state => ({
      liveChatButtonVisibility: !state.liveChatButtonVisibility,
    })),
  toggleLiveChatModalVisibility: () =>
    set(state => ({ liveChatModalVisibility: !state.liveChatModalVisibility })),
}));

export const useCurrentRoute = create<ICurrentRoute>(set => ({
  currentRoute: 'home',
  setCurrentRoute: (
    route: (keyof RootStackParamList | keyof TabsParamList) | undefined,
  ) => set({ currentRoute: route }),
}));

export const useDrawerState = create<IDrawerState>(set => ({
  drawerState: false,
  setDrawerState: (state: boolean) => set({ drawerState: state }),
}));

export const useCustomDrawer = create<ICustomDrawerState>(set => ({
  isOpen: false,
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
  toggleDrawer: () => set((state: ICustomDrawerState) => ({ isOpen: !state.isOpen })),
}));

export const useGameDisplay = create<IStoreGameDisplay>()(
  persist(
    set => ({
      data: undefined,
      last_used_game: undefined,
      deposit_gateway: undefined,
      game_url: undefined,
      from: '',
      setGameUrl: data =>
        set({
          game_url: data.game_url,
          data: data,
        }),
      setDepositGateway: deposit_gateway => set({ deposit_gateway }),
      setFrom: from => set({ from }),
      resetGameDisplay: () =>
        set(state => ({
          last_used_game: {
            data: state.data,
            date: new Date(),
          },
          deposit_gateway: undefined,
          game_url: undefined,
          current_screen: 'game',
          from: '',
          data: undefined,
        })),
    }),
    {
      name: '11ic-native-game-display-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        last_used_game: state.last_used_game,
        data: state.data,
        deposit_gateway: state.deposit_gateway,
        from: state.from,
      }),
    },
  ),
);

export const useTopNavTitle = create<ITopNavTitle>(set => ({
  title: undefined,
  setTitle: (title: string | undefined) => set({ title }),
}));

export const useLandscapeMode = create<{
  isLandscape: boolean;
  setIsLandscape: (isLandscape: boolean) => void;
}>(set => ({
  isLandscape: false,
  setIsLandscape: (isLandscape: boolean) => set({ isLandscape }),
}));

interface PopUp {
  isOpen: boolean;
  openPopUp: () => void;
  closePopUp: () => void;
  lastLoginToken: string | null;
  markPopupShownForSession: (token: string | null) => void;
  reset: () => void;
}

export const usePopUp = create<PopUp>()(
  persist(
    set => ({
      isOpen: false,
      openPopUp: () => set({ isOpen: true }),
      closePopUp: () => set({ isOpen: false }),
      lastLoginToken: null,
      markPopupShownForSession: (token: string | null) => {
        // Only update if token is different to avoid unnecessary updates
        const currentState = usePopUp.getState();
        if (currentState.lastLoginToken !== token) {
          set({ lastLoginToken: token });
        }
      },
      reset: () => set({ lastLoginToken: null }),
    }),
    {
      name: '11ic-native-popup-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        lastLoginToken: state.lastLoginToken,
      }),
    },
  ),
);

export const useLastRequestPayload = create<{
  payload: any;
  savePayload: (payload: any) => void;
}>(set => ({
  payload: null,
  savePayload: (payload: any) => set({ payload }),
}));
