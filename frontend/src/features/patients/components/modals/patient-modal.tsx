import { Modal } from '../../../../shared/ui/modal';

interface PatientModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PatientModal = ({ isOpen, onClose }: PatientModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nouveau patient">
            <div>Formulaire de création de patient à implémenter</div>
        </Modal>
    );
};
