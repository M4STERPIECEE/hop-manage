import type * as React from "react";

import { cn } from "src/shared/lib/utils";

function EmptyState({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-40 items-center justify-center rounded-lg border border-border border-dashed text-muted-foreground text-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { EmptyState };
