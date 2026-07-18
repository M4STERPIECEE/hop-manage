import {
  Root,
  Trigger,
  Value,
  Icon,
  Portal,
  Content,
  Viewport,
  Group,
  Label,
  Item,
  ItemText,
  ItemIndicator,
  Separator,
  ScrollUpButton,
  ScrollDownButton,
} from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import type * as React from "react";

import { cn } from "src/shared/lib/utils";

const Select = Root;
const SelectGroup = Group;
const SelectValue = Value;

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Trigger>) {
  return (
    <Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className,
      )}
      {...props}
    >
      {children}
      <Icon asChild>
        <ChevronDown className="size-4 opacity-50" />
      </Icon>
    </Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof Content>) {
  return (
    <Portal>
      <Content
        data-slot="select-content"
        className={cn(
          "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <ScrollUpButton className="flex cursor-default items-center justify-center py-1">
          <ChevronUp className="size-4" />
        </ScrollUpButton>
        <Viewport
          className={cn(
            "p-1",
            position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </Viewport>
        <ScrollDownButton className="flex cursor-default items-center justify-center py-1">
          <ChevronDown className="size-4" />
        </ScrollDownButton>
      </Content>
    </Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-sm font-semibold", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Item>) {
  return (
    <Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none focus-visible:outline-none focus-visible:ring-0 select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <ItemIndicator>
          <Check className="size-4" />
        </ItemIndicator>
      </span>
      <ItemText>{children}</ItemText>
    </Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
