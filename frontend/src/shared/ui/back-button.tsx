import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, type LinkProps } from "react-router-dom";
import type { ReactNode } from "react";

import { cn } from "src/shared/lib/utils";
import { buttonVariants } from "src/shared/ui/button";

type BackButtonProps = Omit<LinkProps, "children" | "className"> & {
  children?: ReactNode;
  className?: string;
};

export function BackButton({ className, children, ...props }: BackButtonProps) {
  return (
    <Link
      {...props}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "-ml-2 w-fit text-muted-foreground",
        className,
      )}
    >
      <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
      {children}
    </Link>
  );
}
