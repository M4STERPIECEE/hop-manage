import type { ComponentProps, ReactNode } from "react";
import { useFormatError } from "src/shared/lib/use-format-error";
import { cn } from "src/shared/lib/utils";
import { Input } from "src/shared/ui/input";
import { Label } from "src/shared/ui/label";
import { useFieldContext } from "./form-context";

type InputFieldProps = {
  label: string;
  labelAction?: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
} & Omit<ComponentProps<typeof Input>, "value" | "onChange" | "onBlur">;

export function InputField({
  label,
  labelAction,
  startIcon,
  endIcon,
  className,
  ...props
}: InputFieldProps) {
  const field = useFieldContext<string>();
  const formatError = useFormatError();
  const error = field.state.meta.isValid
    ? undefined
    : formatError(field.state.meta.errors);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={field.name}>{label}</Label>
        {labelAction}
      </div>
      <div className="relative">
        {startIcon && (
          <>
            <span className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 text-muted-foreground *:size-4">
              {startIcon}
            </span>
            <div className="absolute left-10 top-1/2 -translate-y-1/2 h-5 w-px bg-gray-300 pointer-events-none z-10" />
          </>
        )}
        <Input
          {...props}
          id={field.name}
          name={field.name}
          value={field.state.value ?? ""}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={!!error || undefined}
          className={cn(startIcon && "pl-14", endIcon && "pr-7", className)}
        />
        {endIcon && (
          <span className="-translate-y-1/2 absolute top-1/2 right-2 text-muted-foreground *:size-4">
            {endIcon}
          </span>
        )}
      </div>
      {error && (
        <span role="alert" className="text-destructive text-sm">
          {error}
        </span>
      )}
    </div>
  );
}
