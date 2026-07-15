import { Input, type InputProps } from '../ui/input';

interface InputFieldProps extends Omit<InputProps, 'name' | 'value' | 'onChange' | 'onBlur'> {
  field: any;
  label?: string;
}

export function InputField({ field, label, id, ...props }: InputFieldProps) {
  const inputId = id || field.name;
  const isError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--text-dark)]">
          {label}
        </label>
      )}
      <Input
        id={inputId}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={isError ? 'border-[var(--danger)] focus:ring-[var(--danger)]' : ''}
        {...props}
      />
      {isError && (
        <p className="text-xs text-[var(--danger)] mt-1">
          {field.state.meta.errors.join(', ')}
        </p>
      )}
    </div>
  );
}
