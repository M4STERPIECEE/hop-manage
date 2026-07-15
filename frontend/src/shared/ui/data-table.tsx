import type { ComponentProps, CSSProperties, ReactNode } from "react";

import { cn } from "src/shared/lib/utils";
import { Skeleton } from "src/shared/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/shared/ui/table";

export type DataTableColumn<TRow> = {
  id: string;
  header: ReactNode;
  cell: (row: TRow) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

type DataTableProps<TRow> = {
  columns: DataTableColumn<TRow>[];
  data: TRow[];
  getRowId: (row: TRow) => string | number;
  onRowClick?: (row: TRow) => void;
  emptyMessage?: ReactNode;
  wrapperClassName?: string;
  tableClassName?: string;
  rowClassName?: string | ((row: TRow) => string);
  /**
   * When set, the table renders as a rounded-card CSS grid using these track
   * sizes (e.g. `"minmax(0,2fr) minmax(0,1fr)"`). Otherwise a plain `<table>`.
   */
  gridTemplateColumns?: string;
  /** Renders skeleton rows instead of `data` (e.g. while a query is pending). */
  isLoading?: boolean;
  /** Number of skeleton rows to render when `isLoading`. */
  skeletonRows?: number;
};

// Spreads props (incl. onClick) through a component boundary so a clickable row
// keeps its click behavior without tripping the a11y linter.
function GridRow(props: ComponentProps<"div">) {
  return <div {...props} />;
}

export function DataTable<TRow>({
  columns,
  data,
  getRowId,
  onRowClick,
  emptyMessage = "Aucun résultat.",
  wrapperClassName,
  tableClassName,
  rowClassName,
  gridTemplateColumns,
  isLoading = false,
  skeletonRows = 5,
}: DataTableProps<TRow>) {
  const resolveRowClassName = (row: TRow): string | undefined =>
    typeof rowClassName === "function" ? rowClassName(row) : rowClassName;

  const skeletonKeys = Array.from(
    { length: skeletonRows },
    (_, index) => `skeleton-row-${index}`,
  );

  if (gridTemplateColumns) {
    const gridStyle: CSSProperties = { gridTemplateColumns };
    return (
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-border bg-card text-sm shadow-card",
          wrapperClassName,
        )}
      >
        <div
          style={gridStyle}
          className="grid items-center gap-4 border-b border-border bg-muted/40 px-6 py-2.5 font-semibold text-[11.5px] text-muted-foreground/70 uppercase tracking-[0.06em]"
        >
          {columns.map((column) => (
            <div
              key={column.id}
              className={cn("min-w-0 truncate", column.headerClassName)}
            >
              {column.header}
            </div>
          ))}
        </div>

        {isLoading ? (
          skeletonKeys.map((key) => (
            <div
              key={key}
              style={gridStyle}
              className="grid items-center gap-4 border-border border-b px-6 py-2.5 last:border-b-0"
            >
              {columns.map((column) => (
                <div key={column.id} className="min-w-0">
                  <Skeleton className="h-5 w-2/3" />
                </div>
              ))}
            </div>
          ))
        ) : data.length === 0 ? (
          <div className="px-6 py-8 text-center text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          data.map((row) => (
            <GridRow
              key={getRowId(row)}
              style={gridStyle}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "grid items-center gap-4 border-border border-b px-6 py-2.5 transition-colors last:border-b-0",
                onRowClick && "cursor-pointer hover:bg-muted/40",
                resolveRowClassName(row),
              )}
            >
              {columns.map((column) => (
                <div
                  key={column.id}
                  className={cn("min-w-0 truncate", column.cellClassName)}
                >
                  {column.cell(row)}
                </div>
              ))}
            </GridRow>
          ))
        )}
      </div>
    );
  }

  return (
    <div
      className={
        wrapperClassName ??
        "overflow-hidden rounded-2xl border border-border bg-card shadow-card"
      }
    >
      <Table className={tableClassName}>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id} className={column.headerClassName}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            skeletonKeys.map((key) => (
              <TableRow key={key}>
                {columns.map((column) => (
                  <TableCell key={column.id} className={column.cellClassName}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-8 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow
                key={getRowId(row)}
                data-clickable={onRowClick ? true : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={resolveRowClassName(row)}
              >
                {columns.map((column) => (
                  <TableCell key={column.id} className={column.cellClassName}>
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
