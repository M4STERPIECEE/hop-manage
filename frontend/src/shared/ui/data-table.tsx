import type { ReactNode } from 'react';
import { Search, ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';

interface DataTableProps {
    title: string;
    subtitle?: string;
    onAdd?: () => void;
    addButtonText?: string;
    searchPlaceholder?: string;
    searchValue?: string;
    onSearch?: (value: string) => void;
    filters?: ReactNode;
    isLoading?: boolean;
    isEmpty?: boolean;
    emptyMessage?: string;
    emptySubMessage?: string;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    children: ReactNode;
}

export function DataTable({
    title,
    subtitle,
    onAdd,
    addButtonText = 'Nouveau',
    searchPlaceholder = 'Rechercher...',
    searchValue,
    onSearch,
    filters,
    isLoading = false,
    isEmpty = false,
    emptyMessage = 'Aucune donnée trouvée',
    emptySubMessage = 'Essayez de modifier vos critères de recherche',
    currentPage,
    totalPages,
    onPageChange,
    children,
}: DataTableProps) {
    return (
        <div className="bg-[var(--bg-white)] rounded-xl p-6 shadow-sm border border-[var(--border)]">
            <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
                <div>
                    <h2 className="font-poppins text-2xl font-bold text-[var(--primary)] mb-1">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-sm text-[var(--primary)] opacity-60 font-medium">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="flex gap-4 items-center flex-nowrap max-w-full">
                    {onSearch && (
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearch(e.target.value)}
                            className="w-full md:w-[300px]"
                        />
                    )}
                    
                    {onAdd && (
                        <Button onClick={onAdd} variant="secondary" className="flex items-center gap-2 font-semibold">
                            <Plus className="h-4 w-4" />
                            {addButtonText}
                        </Button>
                    )}
                </div>
            </div>

            {filters && (
                <div className="mb-6">
                    {filters}
                </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-[var(--border)] min-h-[200px] relative">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
                    </div>
                ) : isEmpty ? (
                    <div className="text-center py-16">
                        <Search className="h-12 w-12 text-[var(--text-gray)] mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-semibold text-[var(--primary)] mb-2">{emptyMessage}</p>
                        <p className="text-sm text-[var(--text-gray)]">{emptySubMessage}</p>
                    </div>
                ) : (
                    children
                )}
            </div>

            {totalPages !== undefined && currentPage !== undefined && onPageChange && totalPages > 0 && !isLoading && !isEmpty && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold text-sm text-[var(--primary)]">
                        Page {currentPage + 1} sur {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                        disabled={currentPage >= totalPages - 1}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}