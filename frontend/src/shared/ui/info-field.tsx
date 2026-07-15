import type * as React from "react";

import { cn } from "src/shared/lib/utils";

function InfoField({
  label,
  value,
  className,
  ...props
}: React.ComponentProps<"div"> & { label: string; value?: string }) {
  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-medium text-foreground text-sm">
        {value || "—"}
      </span>
    </div>
  );
}

export { InfoField };
