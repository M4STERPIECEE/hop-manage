import { type RefObject, useEffect, useState } from "react";

type GridFillOptions = {
  /** Minimum column width in px (matches the grid's `minmax` track). */
  minColumnWidth: number;
  /** Height of a single row/item in px. */
  rowHeight: number;
  /** Gap between rows and columns in px. */
  gap: number;
  /** Container inner padding subtracted from the measured size (px). */
  padding?: number;
  /** Count used before the first measurement (SSR / initial render). */
  fallback: number;
};

/**
 * Number of grid items that fill a container's visible area — columns from its
 * width, rows from its height — recomputed on resize. Lets a paginated grid
 * request exactly one screenful instead of a fixed page size.
 */
export function useGridFillCount(
  ref: RefObject<HTMLElement | null>,
  { minColumnWidth, rowHeight, gap, padding = 0, fallback }: GridFillOptions,
): number {
  const [count, setCount] = useState(fallback);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const measure = () => {
      const width = el.clientWidth - padding;
      const height = el.clientHeight - padding;
      if (width <= 0 || height <= 0) return;
      const columns = Math.max(
        1,
        Math.floor((width + gap) / (minColumnWidth + gap)),
      );
      const rows = Math.max(1, Math.floor((height + gap) / (rowHeight + gap)));
      setCount(columns * rows);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, minColumnWidth, rowHeight, gap, padding]);

  return count;
}
