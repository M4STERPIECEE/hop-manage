import { Toaster as Sonner, toast } from 'sonner';

export const toaster = {
    create: (options: { title?: string; description?: string; type?: 'success' | 'error' | 'info' | 'warning' }) => {
        const { title, description, type } = options;
        const msg = title || description;
        if (type === 'success') {
            toast.success(msg, { description: title && description ? description : undefined });
        } else if (type === 'error') {
            toast.error(msg, { description: title && description ? description : undefined });
        } else {
            toast(msg, { description: title && description ? description : undefined });
        }
    }
};

export function Toaster() {
    return (
        <Sonner position="top-right" richColors />
    );
}
