import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cn } from "src/shared/lib/utils";

function RadioGroup<Value extends string>({
  className,
  ...props
}: RadioGroupPrimitive.Props<Value>) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function Radio({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio"
      className={cn("group/radio flex items-center gap-2", className)}
      {...props}
    >
      <span
        data-slot="radio-indicator"
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-full border border-input shadow-xs outline-none transition-[box-shadow,background-color,border-color]",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[checked]:border-primary data-[checked]:bg-primary data-[checked]:text-primary-foreground",
        )}
      >
        <RadioPrimitive.Indicator
          className={cn(
            "flex items-center justify-center",
            "hidden size-[7px] rounded-full bg-current group-data-[checked]/radio:block",
          )}
        />
      </span>
      <span data-slot="radio-label" className="text-sm">
        {props.children}
      </span>
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, Radio };
