import { PageRequest } from "../../gen/cosmos/base/query/v1beta1/pagination";

export type SanitizedPageRequest = Partial<
  Omit<PageRequest, "key"> & { key: string }
>;
export type SanitizedPageResponse = {
  total: number;
  next: string | null;
};
