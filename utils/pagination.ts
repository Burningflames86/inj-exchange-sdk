import { base64 } from "@scure/base";
import type { Pagination, PaginationOption } from "../types/chain/pagination";
import type {
  PageRequest,
  PageResponse,
} from "../gen/cosmos/base/query/v1beta1/pagination";

/** Turns a caller's paging request into the proto request, key decoded. */
export function toPageRequest(
  option: PaginationOption | undefined,
): PageRequest | undefined {
  return option
    ? {
        key: option.key
          ? Buffer.from(base64.decode(option.key))
          : Buffer.from([]),
        offset: option.offset || 0,
        limit: option.limit || 0,
        countTotal: option.countTotal || false,
        reverse: option.reverse || false,
      }
    : undefined;
}

/** Turns the proto response's paging into the shape a caller receives. */
export function toPagination(response: PageResponse | undefined): Pagination {
  return {
    total: response?.total ? response.total : 0,
    // The chain decodes an absent key as empty bytes, not undefined.
    next: response?.nextKey?.length ? base64.encode(response.nextKey) : null,
  };
}
