import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";

import { cn } from "src/shared/lib/utils";
import { Button } from "src/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/shared/ui/popover";

type ComboboxContextType<T> = {
  items: T[];
  value: T | null;
  onValueChange: (value: T | null) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const ComboboxContext = React.createContext<ComboboxContextType<any> | null>(
  null,
);

function useComboboxContext<T>() {
  const context = React.useContext(ComboboxContext);
  if (!context) {
    throw new Error(
      "Combobox sub-components must be used within a <Combobox />",
    );
  }
  return context as ComboboxContextType<T>;
}

function Combobox<T>({
  items,
  value,
  onValueChange,
  children,
}: {
  items: T[];
  value: T | null;
  onValueChange: (value: T | null) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <ComboboxContext.Provider
      value={{ items, value, onValueChange, open, setOpen, searchQuery, setSearchQuery }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </ComboboxContext.Provider>
  );
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PopoverTrigger>) {
  return (
    <PopoverTrigger asChild {...props}>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={false}
        className={cn(
          "w-full justify-between font-normal",
          !children && "text-muted-foreground",
          className,
        )}
      >
        {children}
        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
  );
}

function ComboboxValue({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const { value, items } = useComboboxContext();
  const display = value
    ? String(
        (items as any[]).find(
          (item: any) => item.value === (value as any).value,
        )?.label ?? (value as any).label,
      )
    : null;

  return (
    <span
      data-slot="combobox-value"
      className={cn("flex-1 text-left", className)}
      {...props}
    >
      {display}
    </span>
  );
}

function ComboboxInput({
  className,
  placeholder,
  ...props
}: Omit<React.ComponentProps<"input">, "size">) {
  const { searchQuery, setSearchQuery } = useComboboxContext();

  return (
    <div className="flex items-center border-b px-3 pb-2 mb-2">
      <input
        data-slot="combobox-input"
        placeholder={placeholder ?? "Rechercher..."}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={cn(
          "flex h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="size-6 p-0"
          onClick={() => setSearchQuery("")}
        >
          <X className="size-3" />
        </Button>
      )}
    </div>
  );
}

function ComboboxContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PopoverContent>) {
  return (
    <PopoverContent
      data-slot="combobox-content"
      className={cn("w-(--radix-popover-trigger-width) p-0", className)}
      {...props}
    >
      {children}
    </PopoverContent>
  );
}

function ComboboxList<T>({
  children,
}: {
  children: (item: T) => React.ReactNode;
}) {
  const { items, searchQuery, value, onValueChange, setOpen } =
    useComboboxContext<T>();

  const filtered = items.filter((item: any) => {
    if (!searchQuery) return true;
    const label = String(item.label ?? "").toLowerCase();
    return label.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-h-60 overflow-y-auto p-1">
      {filtered.map((item: any, index: number) => (
        <div
          key={item.key ?? index}
          role="option"
          aria-selected={value === item}
          tabIndex={0}
          className={cn(
            "relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground",
            value === item && "bg-accent text-accent-foreground",
          )}
          onClick={() => {
            onValueChange(item);
            setOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onValueChange(item);
              setOpen(false);
            }
          }}
        >
          <span className="absolute left-2 flex size-3.5 items-center justify-center">
            {value === item && <Check className="size-4" />}
          </span>
          {children(item)}
        </div>
      ))}
    </div>
  );
}

function ComboboxItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<"div"> & { value?: unknown }) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

function ComboboxGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="combobox-group"
      className={cn("", className)}
      {...props}
    />
  );
}

function ComboboxLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="combobox-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

function ComboboxEmpty({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { items, searchQuery } = useComboboxContext();
  const hasItems = items.length > 0;

  if (hasItems && !searchQuery) return null;

  return (
    <div
      data-slot="combobox-empty"
      className={cn(
        "py-6 text-center text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="combobox-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}

export {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
};
