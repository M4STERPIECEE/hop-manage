import { useFormatError } from "src/shared/lib/use-format-error";
import { DatePicker } from "src/shared/ui/date-picker";
import { Label } from "src/shared/ui/label";
import { useFieldContext } from "./form-context";

type DateFieldProps = { label: string; placeholder?: string; fromDate?: Date };

export function DateField({ label, placeholder, fromDate }: DateFieldProps) {
  const field = useFieldContext<string>();
  const formatError = useFormatError();
  const error = field.state.meta.isValid
    ? undefined
    : formatError(field.state.meta.errors);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name} className="text-sm font-medium">
        {label}
      </Label>
      <DatePicker
        id={field.name}
        placeholder={placeholder}
        value={field.state.value ?? ""}
        onChange={(value) => field.handleChange(value)}
        onBlur={field.handleBlur}
        fromDate={fromDate}
        className="w-full h-8 px-3"
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