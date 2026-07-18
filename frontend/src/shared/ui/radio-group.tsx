import {
  Root,
  Item,
  Indicator,
} from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "src/shared/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof Root>) {
  return (
    <Root
      data-slot="radio-group"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function Radio({
  className,
  ...props
}: React.ComponentProps<typeof Item>) {
  return (
    <Item
      data-slot="radio"
      className={cn(
        "aspect-square size-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <Indicator className="flex items-center justify-center">
        <Circle className="size-2.5 fill-current text-current" />
      </Indicator>
    </Item>
  );
}

export { RadioGroup, Radio };
