import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { IAuthToken, IPanelInfoResponse } from '../types/api';
import type { IBalanceResponse } from '../types/player';
import { queryClient } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWithdraw } from '../screens/deposit-withdraw/store';
import { usePopUp } from './useUIStore';

interface AppState {
  user: IPanelInfoResponse | null;
  ip: string | null;
  balance: IBalanceResponse | null;
  token: IAuthToken | null;
  adjust_id: string | null;
  setUser: (user: AppState['user']) => void;
  setBalance: (balance: AppState['balance']) => void;
  setToken: (token: IAuthToken | null) => void;
  setAdjustId: (adjust_id: string) => void;
  setIp: (ip: AppState['ip']) => void;
  logout: () => Promise<void>;
}

export const useUserStore = create<AppState>()(
  persist(
    set => ({
      user: null,
      ip: null,
      balance: null,
      token: null,
      adjust_id: null,
      setAdjustId: adjust_id => set({ adjust_id }),
      setUser: user => set({ user }),
      setBalance: balance => set({ balance }),
      setToken: token => set({ token }),
      setIp: ip => set({ ip }),
      logout: async () => {
        set({ user: null, token: null, balance: null, ip: null });
        queryClient.clear();
        await AsyncStorage.removeItem('11ic-native-storage');
        useWithdraw.getState().reset();
        // Reset popup state so it shows again on next login
        usePopUp.getState().reset();
      },
    }),
    {
      name: '11ic-native-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        token: state.token,
        user: state.user,
        balance: state.balance,
        ip: state.ip,
        adjust_id: state.adjust_id,
      }),
      version: 1,
    },
  ),
);
