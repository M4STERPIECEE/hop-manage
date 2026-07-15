import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "src/shared/lib/utils";

const cornerRibbonVariants = cva(
  "-right-12 pointer-events-none absolute top-4 rotate-45 px-12 py-1 text-center font-semibold text-[10px] uppercase tracking-wide",
  {
    variants: {
      variant: {
        success: "bg-success text-success-foreground",
        neutral: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { variant: "success" },
  },
);

type CornerRibbonProps = React.ComponentProps<"span"> &
  VariantProps<typeof cornerRibbonVariants> & { label: string };

function CornerRibbon({
  label,
  variant,
  className,
  ...props
}: CornerRibbonProps) {
  return (
    <span
      data-slot="corner-ribbon"
      data-testid="corner-ribbon"
      data-variant={variant ?? "success"}
      className={cn(cornerRibbonVariants({ variant }), className)}
      {...props}
    >
      {label}
    </span>
  );
}

export { CornerRibbon, cornerRibbonVariants };
