import { type ComponentProps, useEffect, useState } from "react";

import { useFormatError } from "src/shared/lib/use-format-error";
import { Input } from "src/shared/ui/input";
import { Label } from "src/shared/ui/label";
import { useFieldContext } from "./form-context";

type NumberFieldProps = { label: string } & Omit<
  ComponentProps<typeof Input>,
  "value" | "onChange" | "onBlur" | "type"
>;

const toText = (value: number): string => (value === 0 ? "" : String(value));

export function NumberField({ label, ...props }: NumberFieldProps) {
  const field = useFieldContext<number>();
  const formatError = useFormatError();
  const error = field.state.meta.isValid
    ? undefined
    : formatError(field.state.meta.errors);

  // Keep the raw input text locally so the box can be empty / freely edited
  // while the form still holds a number (empty is treated as 0).
  const fieldValue = field.state.value;
  const [text, setText] = useState(() => toText(fieldValue));

  // Reflect external changes (form reset, edit prefill) without clobbering
  // what the user is currently typing.
  useEffect(() => {
    setText((current) =>
      Number(current || "0") === fieldValue ? current : toText(fieldValue),
    );
  }, [fieldValue]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        {...props}
        type="number"
        inputMode="numeric"
        id={field.name}
        name={field.name}
        value={text}
        placeholder={props.placeholder ?? "0"}
        onChange={(e) => {
          setText(e.target.value);
          field.handleChange(
            e.target.value === "" ? 0 : e.target.valueAsNumber || 0,
          );
        }}
        onBlur={field.handleBlur}
        aria-invalid={!!error || undefined}
      />
      {error && (
        <span role="alert" className="text-destructive text-sm">
          {error}
        </span>
      )}
    </div>
  );
}
