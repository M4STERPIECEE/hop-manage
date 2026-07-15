import { Box } from '@chakra-ui/react';
import { Modal } from '../../../../shared/ui/modal';

interface PatientModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PatientModal = ({ isOpen, onClose }: PatientModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nouveau patient">
            <Box>Formulaire de création de patient à implémenter</Box>
        </Modal>
    );
};
