import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

import { useDebouncedCallback } from "src/shared/hooks/use-debounced-callback";
import { cn } from "src/shared/lib/utils";
import { Input } from "src/shared/ui/input";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delayMs?: number;
  size?: "default" | "lg";
  /** Layout classes for the wrapper (width, flex). */
  className?: string;
  /** Extra classes for the input itself (e.g. height). */
  inputClassName?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder,
  delayMs = 300,
  size: _size,
  className,
  inputClassName,
}: SearchInputProps) {
  const [term, setTerm] = useState(value);
  const debouncedOnChange = useDebouncedCallback(onChange, delayMs);

  // Reflect external changes (filters reset, back navigation) into the field.
  useEffect(() => {
    setTerm(value);
  }, [value]);

  return (
    <div className={cn("relative", className)}>
      <HugeiconsIcon
        icon={Search01Icon}
        strokeWidth={2}
        className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2 size-4 text-muted-foreground"
      />
      <Input
        type="search"
        placeholder={placeholder}
        value={term}
        onChange={(event) => {
          setTerm(event.target.value);
          debouncedOnChange(event.target.value);
        }}
        className={cn("pl-7", inputClassName)}
      />
    </div>
  );
}
