import type { UseFormReturn } from "react-hook-form";
import type { IPlayerCardInfo } from "./player";

export type BankType = {
  amount: number;
  reference_number: string | null;
  image: any;
};

export type OnlinePayType = {
  amount: number;
};

export type CryptoType = {
  amount: number;
  amount_in_rupees: number | null;
};

export interface IDepWithState {
  activeTab: "deposit" | "withdraw";
  setActiveTab: (tab: "deposit" | "withdraw") => void;
}

export interface IDepOptionState {
  activeDepOption: "eWallet" | "bankTransfer" | "crypto";
  setActiveDepOption: (option: "eWallet" | "bankTransfer" | "crypto") => void;
}

export interface IWithdrawOptionState {
  activeWithdrawOption: "eWallet" | "bankTransfer" | "crypto";
  setActiveWithdrawOption: (option: "eWallet" | "bankTransfer" | "crypto") => void;
}

export interface IDepWithCustomDialogConfig {
  key?: string;
  title?: string | React.ReactNode;
  content:
    | "real_name"
    | "wallet_password"
    | "otp_verify"
    | "withdraw_req"
    | "set_withdraw_pass";
  submitText?: string;
  closeText?: string;
  externalForm?: UseFormReturn<any>;
  externalValue?: any;
  onSuccess?: () => void;
  onClose?: () => void;
}
export interface IDepWithCustomDialogState {
  visibility: boolean;
  config: IDepWithCustomDialogConfig | undefined;
  openDialog: (config?: IDepWithCustomDialogConfig) => void;
  closeDialog: () => void;
}

export interface ISelectedOptionState {
  index: number;
  selectedOption: any;
  setSelectedOption: (option: any, index: number) => void;
}

export interface IDepositRequestB2BPayload {
  amount: number;
  group: string;
  channel_id: string;
  device?: number;
  image: File | null;
  bank_account_name?: string;
  bank_account_num?: string;
  bank_name?: string;
  ref_id?: string | null;
  max_deposit?: number;
  min_deposit?: number;
}

export interface IWithdrawState {
  selectedOption: IPlayerCardInfo[];
  selectedCard: IPlayerCardInfo | null;
  setSelectedOption: (option: IPlayerCardInfo[]) => void;
  setSelectedCard: (option: IPlayerCardInfo) => void;
  reset: () => void;
}

export type OnlinePayRequestParams = {
  req: OnlinePayType & { channel_id: string };
  openInIframe?: (url: string) => void;
};

export type OnlinePayRequest = {
  amount: number;
  channel_id: string;
  domain: string;
  image: string | null;
}
export type OnlinePayResponse = {
  payment_type: string;
  urllink: string
};