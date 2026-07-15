import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";

import { cn } from "src/shared/lib/utils";
import { Button } from "src/shared/ui/button";
import { Calendar } from "src/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "src/shared/ui/popover";

/** Odoo stores dates as `YYYY-MM-DD`; we parse/format in local time to avoid TZ drift. */
const ODOO_DATE = "yyyy-MM-dd";

type DatePickerProps = {
  /** `YYYY-MM-DD` or an empty string when unset. */
  value: string;
  onChange: (value: string) => void;
  /** Called when the popover closes (use to trigger field blur/validation). */
  onBlur?: () => void;
  placeholder?: string;
  id?: string;
  className?: string;
  "aria-invalid"?: boolean;
};

export function DatePicker({
  value,
  onChange,
  onBlur,
  placeholder = "Sélectionner une date",
  id,
  className,
  "aria-invalid": ariaInvalid,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? parse(value, ODOO_DATE, new Date()) : undefined;

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) onBlur?.();
      }}
    >
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            aria-invalid={ariaInvalid}
            className={cn(
              "w-full justify-between font-normal",
              !value && "text-muted-foreground",
              className,
            )}
          >
            <span className="truncate">
              {selected
                ? format(selected, "d MMMM yyyy", { locale: fr })
                : placeholder}
            </span>
            <HugeiconsIcon
              icon={Calendar03Icon}
              strokeWidth={2}
              className="size-3.5 text-muted-foreground"
            />
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={fr}
          captionLayout="dropdown"
          startMonth={new Date(2000, 0)}
          endMonth={new Date(2035, 11)}
          selected={selected}
          onSelect={(date) => {
            onChange(date ? format(date, ODOO_DATE) : "");
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
