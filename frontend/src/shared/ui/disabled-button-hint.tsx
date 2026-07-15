import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { Button, type buttonVariants } from "src/shared/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "src/shared/ui/tooltip";

type Props = {
  reason: string;
  children: ReactNode;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
};

export function DisabledButtonHint({
  reason,
  children,
  variant = "default",
  size = "default",
}: Props) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span className="relative inline-flex">
            <Button variant={variant} size={size} disabled>
              {children}
            </Button>
            <HugeiconsIcon
              icon={InformationCircleIcon}
              strokeWidth={2}
              className="absolute -top-1.5 -right-1.5 size-3.5 rounded-full bg-background text-muted-foreground"
            />
          </span>
        }
      />
      <TooltipContent>{reason}</TooltipContent>
    </Tooltip>
  );
}
