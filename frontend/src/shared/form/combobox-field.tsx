import { useFormatError } from "src/shared/lib/use-format-error";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "src/shared/ui/combobox";
import { Label } from "src/shared/ui/label";
import type { ComboboxOption } from "src/shared/ui/option";
import { useFieldContext } from "./form-context";

type ComboboxFieldProps = {
  label: string;
  options: ComboboxOption[];
  placeholder?: string;
};

export function ComboboxField({
  label,
  options,
  placeholder,
}: ComboboxFieldProps) {
  const field = useFieldContext<number | null>();
  const formatError = useFormatError();
  const error = field.state.meta.isValid
    ? undefined
    : formatError(field.state.meta.errors);
  const selected = options.find((o) => o.value === field.state.value) ?? null;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Combobox
        items={options}
        value={selected}
        onValueChange={(option: ComboboxOption | null) =>
          field.handleChange(option ? option.value : null)
        }
      >
        <ComboboxInput
          id={field.name}
          placeholder={placeholder}
          aria-invalid={!!error || undefined}
          onBlur={field.handleBlur}
        />
        <ComboboxContent>
          <ComboboxEmpty>Aucun résultat.</ComboboxEmpty>
          <ComboboxList>
            {(item: ComboboxOption) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {error && (
        <span role="alert" className="text-destructive text-sm">
          {error}
        </span>
      )}
    </div>
  );
}
