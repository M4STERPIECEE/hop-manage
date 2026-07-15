import type { ComponentProps } from "react";
import { cn } from "src/shared/lib/utils";
import { Button } from "src/shared/ui/button";
import { Spinner } from "src/shared/ui/spinner";
import { useFormContext } from "./form-context";

type SubmitButtonProps = ComponentProps<typeof Button> & {
  isLoading?: boolean;
};

export function SubmitButton({
  children,
  isLoading,
  className,
  ...props
}: SubmitButtonProps) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(s) => s.isSubmitting}>
      {(isSubmitting) => {
        const loading = isSubmitting || isLoading;
        return (
          <Button
            type="submit"
            {...props}
            disabled={loading}
            className={cn("relative", className)}
          >
            {loading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Spinner />
              </span>
            )}
            <span className={cn("contents", loading && "invisible")}>
              {children}
            </span>
          </Button>
        );
      }}
    </form.Subscribe>
  );
}
