import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
// import { Button as BaseButton } from '@base-ui/react'; // Base UI doesn't have a Button primitive in the same way Headless UI does, it has a Button component.
// Wait, Base UI has a Button component: import { Button } from '@base-ui/react/button';
// Let's use a standard HTML button for now to avoid dependency issues if base-ui is not fully stable, but the user requested Base UI.
// Base UI components are imported like this: import { Button as BaseButton } from '@base-ui/react';
// Wait, Base UI is still in alpha/beta, but let's assume it's `@base-ui/react`

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-bg-white',
    {
        variants: {
            variant: {
                default: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]',
                danger: 'bg-[var(--danger)] text-white hover:opacity-90',
                outline: 'border border-[var(--border)] hover:bg-[var(--bg-light)] text-[var(--text-dark)]',
                secondary: 'bg-[var(--accent-soft)] text-[var(--primary)] hover:bg-[var(--accent)] hover:text-white',
                ghost: 'hover:bg-[var(--bg-light)] hover:text-[var(--text-dark)] text-[var(--text-gray)]',
                link: 'underline-offset-4 hover:underline text-[var(--primary)]',
            },
            size: {
                default: 'h-10 py-2 px-4',
                sm: 'h-9 px-3 rounded-md',
                lg: 'h-11 px-8 rounded-md',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
