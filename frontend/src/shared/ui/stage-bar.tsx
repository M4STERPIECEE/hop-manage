import type * as React from "react";

import { cn } from "src/shared/lib/utils";

type StageState = "done" | "current" | "upcoming";

const stageState = (index: number, currentIndex: number): StageState => {
  if (currentIndex < 0) return "upcoming";
  if (index < currentIndex) return "done";
  return index === currentIndex ? "current" : "upcoming";
};

type StageBarProps = React.ComponentProps<"div"> & {
  stages: string[];
  current: string;
};

function StageBar({ stages, current, className, ...props }: StageBarProps) {
  const currentIndex = stages.indexOf(current);

  return (
    <div
      data-slot="stage-bar"
      className={cn(
        "inline-flex items-center overflow-hidden rounded-md border border-border",
        className,
      )}
      {...props}
    >
      {stages.map((stage, index) => (
        <span
          key={stage}
          data-state={stageState(index, currentIndex)}
          className="border-border border-r px-4 py-1.5 font-medium text-muted-foreground text-xs last:border-r-0 data-[state=current]:bg-primary data-[state=current]:text-primary-foreground data-[state=done]:text-foreground"
        >
          {stage}
        </span>
      ))}
    </div>
  );
}

export { StageBar };
