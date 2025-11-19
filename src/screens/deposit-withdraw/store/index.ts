import { create } from "zustand";
import type {
  IDepWithState,
  IDepWithCustomDialogState,
  ISelectedOptionState,
  IWithdrawState,
  IDepWithCustomDialogConfig,
} from "../../../types/deposit";
import type { IOtpState } from "../../../types/withdraw";
import type { IPlayerCardInfo } from "../../../types/player";
import { persist } from "zustand/middleware";
import { usePopUp } from "../../../store/useUIStore";

export const useDepWith = create<IDepWithState>((set) => ({
  activeTab: "deposit",
  setActiveTab: (tab: "deposit" | "withdraw") => set({ activeTab: tab }),
}));

export const useDepOption = create<{
  activeDepOption: "eWallet" | "fastPay" | "bankTransfer" | "crypto" | "easyPay";
  setActiveDepOption: (
    option: "eWallet" | "fastPay" | "bankTransfer" | "crypto" | "easyPay"
  ) => void;
}>((set) => ({
  activeDepOption: "fastPay",
  setActiveDepOption: (option) => set({ activeDepOption: option }),
}));

export const useWithdrawOption = create<{
  activeWithdrawOption: "eWallet" | "bankTransfer" | "crypto" | "easyPay";
  setActiveWithdrawOption: (
    option: "eWallet" | "bankTransfer" | "crypto" | "easyPay"
  ) => void;
}>((set) => ({
  activeWithdrawOption: "eWallet",
  setActiveWithdrawOption: (option) => set({ activeWithdrawOption: option }),
}));

export const useDepWithCustomDialog = create<IDepWithCustomDialogState>(
  (set) => ({
    visibility: false,
    config: undefined,
    openDialog: (config?: IDepWithCustomDialogConfig) => {
      // Check if popup is currently open
      const popupState = usePopUp.getState();
      if (popupState.isOpen) {
        // Don't open the dialog if popup is visible
        // Store the config to show later if needed
        return;
      }
      set({ visibility: true, config });
    },
    closeDialog: () => set({ visibility: false }),
  })
);

export const useSelectedOption = create<ISelectedOptionState>((set) => ({
  index: 0,
  selectedOption: null,
  setSelectedOption: (option: unknown, index: number) =>
    set({ selectedOption: option, index }),
}));

export const useWithdraw = create<IWithdrawState>((set) => ({
  index: 0,
  selectedOption: [],
  selectedCard: null,
  setSelectedOption: (option: IPlayerCardInfo[]) =>
    set({ selectedOption: option }),
  setSelectedCard: (option: IPlayerCardInfo) => set({ selectedCard: option }),
  reset: () => set({ selectedOption: [], selectedCard: null }),
}));

export const useOtp = create<IOtpState>()(
  persist(
    (set) => ({
      lastSent: null,
      setLastSent: () => set({ lastSent: new Date().toISOString() }),
      clearLastSent: () => set({ lastSent: null }),
    }),
    {
      name: "otp",
      partialize: (state) => ({ lastSent: state.lastSent }),
    }
  )
);
