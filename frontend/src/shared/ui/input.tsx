import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "src/shared/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm placeholder:text-[var(--text-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-10",
        lg: "h-12",
        sm: "h-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
