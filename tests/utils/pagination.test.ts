import { describe, expect, it } from "bun:test";
import { base64 } from "@scure/base";
import type { PageResponse } from "../../gen/cosmos/base/query/v1beta1/pagination";
import { toPageRequest, toPagination } from "../../utils/pagination";

describe("toPageRequest", () => {
  it("returns nothing when the caller asks for nothing", () => {
    expect(toPageRequest(undefined)).toBeUndefined();
  });

  it("carries limit, offset, countTotal and reverse through", () => {
    expect(
      toPageRequest({ limit: 2, offset: 5, countTotal: true, reverse: true }),
    ).toEqual({
      key: Buffer.from([]),
      offset: 5,
      limit: 2,
      countTotal: true,
      reverse: true,
    });
  });

  it("fills the proto defaults when the caller omits them", () => {
    expect(toPageRequest({ limit: 2 })).toEqual({
      key: Buffer.from([]),
      offset: 0,
      limit: 2,
      countTotal: false,
      reverse: false,
    });
  });

  it("decodes the cursor the chain handed back", () => {
    const next = base64.encode(new TextEncoder().encode("offset:10"));
    expect(toPageRequest({ key: next })?.key).toEqual(Buffer.from("offset:10"));
  });
});

describe("toPagination", () => {
  it("reports an empty total and no cursor for a bare response", () => {
    expect(toPagination(undefined)).toEqual({ total: 0, next: null });
  });

  it("encodes the chain's next key as the cursor a caller passes back", () => {
    const response = {
      total: 3,
      nextKey: new TextEncoder().encode("offset:3"),
    } as unknown as PageResponse;

    const page = toPagination(response);
    expect(page.total).toBe(3);
    expect(page.next).toBe(base64.encode(new TextEncoder().encode("offset:3")));
    expect(toPageRequest({ key: page.next ?? undefined })?.key).toEqual(
      Buffer.from("offset:3"),
    );
  });

  it("returns a null cursor when the chain says there is no more", () => {
    expect(
      toPagination({
        total: 1,
        nextKey: new Uint8Array(),
      } as unknown as PageResponse),
    ).toEqual({
      total: 1,
      next: null,
    });
  });
});
