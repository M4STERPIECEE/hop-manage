import { useFormatError } from "src/shared/lib/use-format-error";
import { Label } from "src/shared/ui/label";
import type { SelectOption } from "src/shared/ui/option";
import { Radio, RadioGroup } from "src/shared/ui/radio-group";
import { useFieldContext } from "./form-context";

type RadioFieldProps = {
  label: string;
  options: SelectOption[];
};

export function RadioField({ label, options }: RadioFieldProps) {
  const field = useFieldContext<string>();
  const formatError = useFormatError();
  const error = field.state.meta.isValid
    ? undefined
    : formatError(field.state.meta.errors);

  const value = field.state.value ?? "";

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <RadioGroup
        name={field.name}
        value={value}
        onValueChange={(val) => field.handleChange(val)}
        onBlur={field.handleBlur}
      >
        {options.map((option) => (
          <Radio key={option.value} value={option.value}>
            {option.label}
          </Radio>
        ))}
      </RadioGroup>
      {error && (
        <span role="alert" className="text-destructive text-sm">
          {error}
        </span>
      )}
    </div>
  );
}
