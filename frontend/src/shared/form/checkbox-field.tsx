import { Checkbox } from "src/shared/ui/checkbox";
import { Label } from "src/shared/ui/label";
import { useFieldContext } from "./form-context";

type CheckboxFieldProps = { label: string };

export function CheckboxField({ label }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={field.name}
        name={field.name}
        checked={field.state.value ?? false}
        onCheckedChange={(checked) => field.handleChange(checked === true)}
        onBlur={field.handleBlur}
      />
      <Label htmlFor={field.name}>{label}</Label>
    </div>
  );
}
