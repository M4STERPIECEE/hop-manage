import type * as React from "react";

import { cn } from "src/shared/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: reusable primitive; consumers associate it via htmlFor and children
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-[12.5px] leading-none font-semibold text-muted-foreground select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
