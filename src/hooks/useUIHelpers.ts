import { create } from 'zustand';
import { IFormConfig } from '../types/ui';

export interface DialogDrawerState {
  config: IFormConfig | null;
  visible: boolean;
  openDialog: (config: IFormConfig) => void;
  closeDialog: () => void;
}

export const useBottomDrawer = create<DialogDrawerState>(set => ({
  config: null,
  visible: false,
  openDialog: config => set({ config, visible: true }),
  closeDialog: () => set({ visible: false }),
}));

export interface INotificationModalState {
  visible: boolean;
  isViewedAlready: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useNotificationModal = create<INotificationModalState>(set => ({
  visible: false,
  isViewedAlready: false,
  openModal: () => set({ visible: true, isViewedAlready: true }),
  closeModal: () => set({ visible: false }),
}));
