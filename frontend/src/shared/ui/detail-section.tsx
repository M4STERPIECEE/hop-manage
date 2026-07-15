import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import type * as React from "react";

import { cn } from "src/shared/lib/utils";
import { Card } from "src/shared/ui/card";
import { Separator } from "src/shared/ui/separator";

function DetailSection({
  title,
  action,
  icon,
  className,
  asCard = false,
  children,
  ...props
}: React.ComponentProps<"section"> & {
  title: string;
  action?: React.ReactNode;
  icon?: IconSvgElement;
  asCard?: boolean;
}) {
  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon && (
          <HugeiconsIcon
            icon={icon}
            size={18}
            strokeWidth={2}
            className="text-primary"
          />
        )}
        <h2
          className={cn(
            "font-semibold text-foreground",
            asCard ? "text-sm text-primary" : "text-lg",
          )}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );

  const fields = (
    <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
      {children}
    </div>
  );

  if (asCard) {
    return (
      <Card
        className={cn("gap-4 px-(--card-spacing)", className)}
        {...(props as React.ComponentProps<"div">)}
      >
        {header}
        {fields}
      </Card>
    );
  }

  return (
    <section className={cn("flex flex-col gap-4", className)} {...props}>
      {header}
      <Separator />
      {fields}
    </section>
  );
}

export { DetailSection };
