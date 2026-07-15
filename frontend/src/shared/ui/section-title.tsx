import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { ReactNode } from "react";
import { CardTitle } from "src/shared/ui/card";

export function SectionTitle({
  icon,
  children,
}: {
  icon: IconSvgElement;
  children: ReactNode;
}) {
  return (
    <CardTitle className="flex items-center gap-2 text-[14.5px] font-semibold text-foreground">
      <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary">
        <HugeiconsIcon icon={icon} size={16} strokeWidth={2} />
      </span>
      {children}
    </CardTitle>
  );
}
