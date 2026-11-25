/** What a caller passes to ask for a page. Deliberately free of proto types. */
export interface PaginationOption {
  /** Opaque cursor from a previous page's `pagination.next`. */
  key?: string;
  offset?: number;
  /** Chain default when omitted or zero. */
  limit?: number;
  /**
   * Asks the node for the size of the whole set. Injective's public endpoints
   * refuse it — "counting the full set walks all of it" — and the gRPC call
   * hangs until the upstream times out. Leave it off against a public node.
   */
  countTotal?: boolean;
  reverse?: boolean;
}

/** What comes back with a page of results. */
export interface Pagination {
  total: number;
  /** Cursor for the next page, or null when there is nothing after it. */
  next: string | null;
}
