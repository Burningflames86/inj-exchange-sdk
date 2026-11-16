import { BaseAccount, ModuleAccount } from "../../gen/cosmos/auth/v1beta1/auth";
import { SanitizedPageResponse } from "./pagination";

export interface AccountResponse {
  codeHash: string;
  baseAccount: SanitizedBaseAccount;
}
export interface AccountsResponse {
  pagination: SanitizedPageResponse;
  accounts: AccountResponse[];
}

export type SanitizedBaseAccount = Omit<BaseAccount, "pubKey"> & {
  pubKey: { key: string; typeUrl: string } | undefined;
};

export type SanitizedModuleAccount = Omit<ModuleAccount, "baseAccount"> & {
  baseAccount: SanitizedBaseAccount;
};
