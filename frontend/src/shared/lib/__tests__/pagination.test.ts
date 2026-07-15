import { describe, expect, it } from "vitest";
import { getPageItems } from "../pagination";

const values = (page: number, pageCount: number) =>
  getPageItems(page, pageCount).map((item) =>
    item.type === "page" ? item.value : "…",
  );

describe("getPageItems", () => {
  it("lists every page without ellipsis when they all fit", () => {
    expect(values(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("inserts an ellipsis on both sides of a centered current page", () => {
    expect(values(10, 20)).toEqual([1, "…", 9, 10, 11, "…", 20]);
  });

  it("omits the leading ellipsis near the first page", () => {
    expect(values(2, 20)).toEqual([1, 2, 3, "…", 20]);
  });

  it("omits the trailing ellipsis near the last page", () => {
    expect(values(19, 20)).toEqual([1, "…", 18, 19, 20]);
  });

  it("collapses to a single entry for a one-page result", () => {
    expect(values(1, 1)).toEqual([1]);
  });

  it("gives each ellipsis a stable, unique key", () => {
    const keys = getPageItems(10, 20)
      .filter((item) => item.type === "ellipsis")
      .map((item) => (item.type === "ellipsis" ? item.key : ""));

    expect(new Set(keys).size).toBe(keys.length);
  });
});
