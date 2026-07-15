import type { ReactNode } from 'react';
import { cn } from 'src/shared/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    change?: string;
    variant?: 'primary' | 'accent' | 'success' | 'warning';
}

export const StatCard = ({ title, value, icon, change, variant = 'primary' }: StatCardProps) => {
    const borderColors = {
        primary: 'border-l-[var(--primary)]',
        accent: 'border-l-[var(--accent)]',
        success: 'border-l-[var(--success)]',
        warning: 'border-l-[var(--warning)]',
    };

    return (
        <div 
            className={cn(
                "bg-white p-7 rounded-xl shadow-[0_1px_3px_rgba(10,77,104,0.08)] border-l-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(10,77,104,0.12)]",
                borderColors[variant]
            )}
        >
            <div className="flex justify-between items-center mb-4">
                <p className="text-[var(--text-gray)] text-[0.9rem] font-medium">
                    {title}
                </p>
                <div className="w-10 h-10 bg-[var(--accent-soft)] rounded-lg flex items-center justify-center text-xl text-[var(--primary)]">
                    {icon}
                </div>
            </div>
            <div className="font-poppins text-4xl font-bold text-[var(--primary)]">
                {value}
            </div>
            {change && (
                <p className="text-[var(--success)] text-[0.85rem] mt-2 font-medium">
                    {change}
                </p>
            )}
        </div>
    );
};