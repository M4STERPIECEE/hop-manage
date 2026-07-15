import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]',
        secondary:
          'border-transparent bg-[var(--accent-soft)] text-[var(--primary)] hover:bg-[var(--accent)] hover:text-white',
        destructive:
          'border-transparent bg-[var(--danger)] text-white hover:opacity-80',
        outline: 'text-[var(--text-dark)] border-[var(--border)]',
        success: 'border-transparent bg-[var(--success)] text-white hover:opacity-80',
        warning: 'border-transparent bg-[var(--warning)] text-white hover:opacity-80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
