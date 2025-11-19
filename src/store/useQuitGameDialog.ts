import { create } from 'zustand';

interface QuitDialogOptions {
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void;
}

interface QuitDialogState {
  visible: boolean;
  options?: QuitDialogOptions;
  openDialog: (options: QuitDialogOptions) => void;
  closeDialog: () => void;
}

export const useQuitGameDialog = create<QuitDialogState>((set) => ({
  visible: false,
  options: undefined,
  openDialog: (options) => set({ visible: true, options }),
  closeDialog: () => set({ visible: false, options: undefined }),
}));


