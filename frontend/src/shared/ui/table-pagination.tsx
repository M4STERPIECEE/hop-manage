import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "src/shared/ui/pagination";

type TablePaginationProps = {
  /** Zero-based current page index. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Optional total-row count shown on the left (e.g. "27 contrats"). */
  total?: number;
  /** Noun used with `total` (e.g. "contrats"). */
  unit?: string;
};

export function TablePagination({
  page,
  pageCount,
  onPageChange,
  total,
  unit = "éléments",
}: TablePaginationProps) {
  const hasPrev = page > 0;
  const hasNext = page + 1 < pageCount;

  return (
    <div className="flex items-center justify-between text-muted-foreground text-xs">
      <span>{total !== undefined ? `${total} ${unit}` : null}</span>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationPrevious
              variant="outline"
              disabled={!hasPrev}
              onClick={() => hasPrev && onPageChange(page - 1)}
            />
          </PaginationItem>
          <PaginationItem className="px-1 tabular-nums text-primary">
            Page {page + 1} / {pageCount}
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              variant="outline"
              disabled={!hasNext}
              onClick={() => hasNext && onPageChange(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
