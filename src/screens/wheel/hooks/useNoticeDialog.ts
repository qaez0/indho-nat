import { create } from "zustand";

interface NoticeDialogType {
  title: string;
  content: string | React.ReactNode;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  noAction?: boolean;
}

interface NoticeDialogProps {
  visible: boolean;
  config: NoticeDialogType | null;
  open: (config: NoticeDialogType) => void;
  close: () => void;
}

export const useNoticeDialog = create<NoticeDialogProps>((set) => ({
  visible: false,
  config: null,
  open: (config) => set({ visible: true, config }),
  close: () => set({ visible: false }),
}));
