import { Modal } from './modal';
import { Button } from './button';

export interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onCancel} title={title}>
            <div className="py-4 text-[var(--text-gray)]">
                {message}
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={onCancel}>
                    {cancelText}
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    {confirmText}
                </Button>
            </div>
        </Modal>
    );
}