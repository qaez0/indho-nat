export type BankType = {
  bank_name: string;
  bank_account_num: string;
  ifsc?: string;
  payment_method: string;
};

export type UsdtType = {
  wallet_protocol: string
  wallet: string;
  usdt_address: string;
};
