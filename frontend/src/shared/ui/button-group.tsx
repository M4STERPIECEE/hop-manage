import type * as React from "react";

import { cn } from "src/shared/lib/utils";

function ButtonGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: shadcn button-group primitive intentionally uses role="group"
    <div
      data-slot="button-group"
      role="group"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border border-border p-0.5",
        className,
      )}
      {...props}
    />
  );
}

export { ButtonGroup };
