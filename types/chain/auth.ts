import { BaseAccount, ModuleAccount } from "../../gen/cosmos/auth/v1beta1/auth";
import { Pagination } from "./pagination";

export interface AccountResponse {
  codeHash: string;
  baseAccount: SanitizedBaseAccount;
}
export interface AccountsResponse {
  pagination: Pagination;
  accounts: AccountResponse[];
}

export type SanitizedBaseAccount = Omit<BaseAccount, "pubKey"> & {
  pubKey: { key: string; typeUrl: string } | undefined;
};

export type SanitizedModuleAccount = Omit<ModuleAccount, "baseAccount"> & {
  baseAccount: SanitizedBaseAccount;
};
