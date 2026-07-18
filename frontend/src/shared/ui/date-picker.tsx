import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { cn } from "src/shared/lib/utils";
import { Button } from "src/shared/ui/button";
import { Calendar } from "src/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "src/shared/ui/popover";

const ODOO_DATE = "yyyy-MM-dd";

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  id?: string;
  className?: string;
  "aria-invalid"?: boolean;
  fromDate?: Date;
};

export function DatePicker({
  value,
  onChange,
  onBlur,
  placeholder = "Sélectionner une date",
  id,
  className,
  fromDate,
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
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          aria-invalid={ariaInvalid}
          className={cn(
            "w-full justify-between font-normal h-8",
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
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg"
        align="start"
        sideOffset={4}
      >
        <Calendar
          mode="single"
          locale={fr}
          captionLayout="dropdown"
          startMonth={fromDate ?? new Date(2000, 0)}
          endMonth={new Date(2035, 11)}
          disabled={fromDate ? { before: fromDate } : undefined}
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