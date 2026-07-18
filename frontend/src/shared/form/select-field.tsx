import { useFormatError } from "src/shared/lib/use-format-error";
import { Label } from "src/shared/ui/label";
import type { SelectOption } from "src/shared/ui/option";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/shared/ui/select";
import { useFieldContext } from "./form-context";

type SelectFieldProps = {
  label: string;
  options: SelectOption[];
  placeholder?: string;
};

export function SelectField({ label, options, placeholder }: SelectFieldProps) {
  const field = useFieldContext<string>();
  const formatError = useFormatError();
  const error = field.state.meta.isValid
    ? undefined
    : formatError(field.state.meta.errors);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{label}</Label>
        <Select
          value={field.state.value ?? ""}
          onValueChange={(value) => field.handleChange((value as string) ?? "")}
          onOpenChange={(open) => {
            if (!open) field.handleBlur();
          }}
        >
          <SelectTrigger
            id={field.name}
            className="w-full"
            aria-invalid={!!error || undefined}
          >
            <SelectValue placeholder={placeholder}>
              {field.state.value ? (
                options.find((o) => o.value === field.state.value)?.label
              ) : (
                <span className="text-muted-foreground">{placeholder || 'Sélectionnez...'}</span>
              )}
            </SelectValue>
          </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <span role="alert" className="text-destructive text-sm">
          {error}
        </span>
      )}
    </div>
  );
}
