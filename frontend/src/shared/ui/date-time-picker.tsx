import { Calendar03Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";

import { cn } from "src/shared/lib/utils";
import { Button } from "src/shared/ui/button";
import { Calendar } from "src/shared/ui/calendar";
import { Input } from "src/shared/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "src/shared/ui/popover";

const ODOO_DATETIME = "yyyy-MM-dd HH:mm:ss";
const ODOO_DATE = "yyyy-MM-dd";
const TIME_PATTERN = "HH:mm";

type DateTimePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
};

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Sélectionner une date et heure",
  id,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);

  const selected = value ? parse(value, ODOO_DATETIME, new Date()) : undefined;
  const datePart = selected ? format(selected, ODOO_DATE) : "";
  const timePart = selected ? format(selected, TIME_PATTERN) : "";

  const displayValue =
    value && selected
      ? `${format(selected, "d MMMM yyyy", { locale: fr })} à ${timePart}`
      : "";

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange("");
      return;
    }
    const dateStr = format(date, ODOO_DATE);
    const result = timePart
      ? `${dateStr} ${timePart}:00`
      : `${dateStr} 00:00:00`;
    onChange(result);
    setOpen(false);
  };

  const handleTimeChange = (time: string) => {
    if (!datePart) {
      return;
    }
    onChange(`${datePart} ${time}:00`);
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id={id}
              type="button"
              variant="outline"
              className={cn(
                "flex-1 justify-between font-normal",
                !value && "text-muted-foreground",
              )}
            >
              <span className="truncate">{displayValue || placeholder}</span>
              <HugeiconsIcon
                icon={Calendar03Icon}
                strokeWidth={2}
                className="size-3.5 text-muted-foreground shrink-0"
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
            onSelect={handleDateSelect}
          />
        </PopoverContent>
      </Popover>

      <div className="relative flex items-center">
        <HugeiconsIcon
          icon={Clock01Icon}
          strokeWidth={2}
          className="pointer-events-none absolute left-2 size-3.5 text-muted-foreground"
        />
        <Input
          type="time"
          value={timePart}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="w-32 pl-7 text-xs tabular-nums"
          aria-label="Heure"
        />
      </div>
    </div>
  );
}
