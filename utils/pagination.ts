import { base64 } from "@scure/base";
import {
  SanitizedPageRequest,
  SanitizedPageResponse,
} from "../types/chain/pagination";
import {
  PageRequest,
  PageResponse,
} from "../gen/cosmos/base/query/v1beta1/pagination";

export function createUnSanitizedPageRequest(
  pagination: SanitizedPageRequest | undefined,
): PageRequest | undefined {
  return pagination
    ? {
        key: pagination.key
          ? Buffer.from(base64.decode(pagination.key))
          : Buffer.from([]),
        offset: pagination.offset || 0,
        limit: pagination.limit || 0,
        countTotal: pagination.countTotal || false,
        reverse: pagination.reverse || false,
      }
    : undefined;
}

export function createSanitizedPageResponse(
  pagination: PageResponse | undefined,
): SanitizedPageResponse {
  return {
    total: pagination?.total ? pagination.total : 0,
    next: pagination?.nextKey ? base64.encode(pagination.nextKey) : null,
  };
}
