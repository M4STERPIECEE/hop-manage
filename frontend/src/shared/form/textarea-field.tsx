import { useFormatError } from "src/shared/lib/use-format-error";
import { Label } from "src/shared/ui/label";
import { Textarea } from "src/shared/ui/textarea";
import { useFieldContext } from "./form-context";

type TextareaFieldProps = {
  label: string;
  placeholder?: string;
  rows?: number;
};

export function TextareaField({
  label,
  placeholder,
  rows,
}: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const formatError = useFormatError();
  const error = field.state.meta.isValid
    ? undefined
    : formatError(field.state.meta.errors);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Textarea
        id={field.name}
        name={field.name}
        rows={rows}
        placeholder={placeholder}
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
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
