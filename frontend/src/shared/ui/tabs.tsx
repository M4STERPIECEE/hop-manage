import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "src/shared/lib/utils";

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "scrollbar-slim flex items-center gap-1 overflow-x-auto overflow-y-hidden border-border border-b",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "-mb-px inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap border-transparent border-b-2 px-3 py-2 font-medium text-muted-foreground text-sm outline-none transition-colors hover:text-foreground focus-visible:text-foreground data-[active]:border-primary data-[active]:text-foreground [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
