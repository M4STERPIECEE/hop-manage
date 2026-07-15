export type PageItem =
  | { type: "page"; value: number }
  | { type: "ellipsis"; key: string };

/**
 * Builds a compact, windowed list of page entries around the current page,
 * inserting an ellipsis marker for any gap (e.g. `1 … 4 5 6 … 20`).
 */
export function getPageItems(page: number, pageCount: number): PageItem[] {
  const visible = new Set([1, pageCount, page, page - 1, page + 1]);
  const sorted = [...visible]
    .filter((value) => value >= 1 && value <= pageCount)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];
  let previous = 0;
  for (const value of sorted) {
    if (value - previous > 1) {
      items.push({ type: "ellipsis", key: `ellipsis-${previous}-${value}` });
    }
    items.push({ type: "page", value });
    previous = value;
  }
  return items;
}
