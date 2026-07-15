import { cn } from '../lib/utils';

interface Option {
  label: string;
  value: string;
}

interface SelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name' | 'value' | 'onChange' | 'onBlur'> {
  field: any;
  label?: string;
  options: Option[];
}

export function SelectField({ field, label, options, id, className, ...props }: SelectFieldProps) {
  const selectId = id || field.name;
  const isError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-[var(--text-dark)]">
          {label}
        </label>
      )}
      <select
        id={selectId}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={cn(
          'flex h-10 w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          isError ? 'border-[var(--danger)] focus:ring-[var(--danger)]' : '',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {isError && (
        <p className="text-xs text-[var(--danger)] mt-1">
          {field.state.meta.errors.join(', ')}
        </p>
      )}
    </div>
  );
}
