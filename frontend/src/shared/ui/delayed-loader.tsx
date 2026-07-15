import { useEffect, useState } from "react";

import { cn } from "src/shared/lib/utils";
import { Spinner } from "src/shared/ui/spinner";

type DelayedLoaderProps = {
  /** Message revealed once `delayMs` has elapsed (e.g. "taking longer than usual"). */
  message?: string;
  /** Delay before the message appears, in ms. */
  delayMs?: number;
  className?: string;
  spinnerClassName?: string;
};

export function DelayedLoader({
  message,
  delayMs = 4000,
  className,
  spinnerClassName,
}: DelayedLoaderProps) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!message) return;
    setShowMessage(false);
    const id = setTimeout(() => setShowMessage(true), delayMs);
    return () => clearTimeout(id);
  }, [message, delayMs]);

  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center gap-3 p-4 text-center text-muted-foreground text-sm",
        className,
      )}
    >
      <Spinner className={cn("size-6", spinnerClassName)} />
      {message && (
        <p
          className={cn(
            "max-w-xs opacity-0 transition-opacity",
            showMessage && "opacity-100",
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}
