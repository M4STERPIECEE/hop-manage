import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "src/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-bg-white",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]",
        danger: "bg-[var(--danger)] text-white hover:opacity-90",
        outline: "border border-[var(--border)] hover:bg-[var(--bg-light)] text-[var(--text-dark)]",
        secondary: "bg-[var(--accent-soft)] text-[var(--primary)] hover:bg-[var(--accent)] hover:text-white",
        ghost: "hover:bg-[var(--bg-light)] hover:text-[var(--text-dark)] text-[var(--text-gray)]",
        link: "underline-offset-4 hover:underline text-[var(--primary)]",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-xs": "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button" as React.ElementType;
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
