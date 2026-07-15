import { Box, Flex, Text, Input, Button } from '@chakra-ui/react';
import { Modal } from '../../../../shared/ui/modal';

interface EditForm {
    durationMinutes: string;
    price: string;
    status: string;
}

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    editForm: EditForm;
    setEditForm: React.Dispatch<React.SetStateAction<EditForm>>;
    handleUpdateService: () => void;
    isUpdating: boolean;
}

export const ServiceModal = ({
    isOpen,
    onClose,
    editForm,
    setEditForm,
    handleUpdateService,
    isUpdating
}: ServiceModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Modifier le service">
            <Box>
                <Flex direction="column" gap="1.25rem">
                    <Box>
                        <Text mb="0.5rem" fontWeight="600" color="primary" fontSize="0.9rem">Duree (minutes)</Text>
                        <Input type="number" value={editForm.durationMinutes} onChange={(e) => setEditForm(prev => ({ ...prev, durationMinutes: e.target.value }))} placeholder="Ex: 45" size="lg" px="1rem" py="0.75rem" h="48px" fontSize="1rem" borderRadius="8px" border="2px solid" borderColor="rgba(10, 77, 104, 0.2)" _focus={{ borderColor: "accent", boxShadow: "0 0 0 1px var(--colors-accent)" }} />
                    </Box>
                    <Box>
                        <Text mb="0.5rem" fontWeight="600" color="primary" fontSize="0.9rem">Prix (MGA)</Text>
                        <Input type="number" value={editForm.price} onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))} placeholder="Ex: 80000" size="lg" px="1rem" py="0.75rem" h="48px" fontSize="1rem" borderRadius="8px" border="2px solid" borderColor="rgba(10, 77, 104, 0.2)" _focus={{ borderColor: "accent", boxShadow: "0 0 0 1px var(--colors-accent)" }} />
                    </Box>
                    <Box>
                        <Text mb="0.5rem" fontWeight="600" color="primary" fontSize="0.9rem">Statut</Text>
                        <select style={{ width: '100%', height: '48px', padding: '0 2.5rem 0 1rem', fontSize: '1rem', borderRadius: '8px', border: '2px solid rgba(10, 77, 104, 0.2)', outline: 'none', backgroundColor: 'white', cursor: 'pointer' }} value={editForm.status} onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}>
                            <option value="Actif">Actif</option>
                            <option value="Inactif">Inactif</option>
                        </select>
                    </Box>
                    <Flex justify="flex-end" gap="1rem" mt="1.5rem">
                        <Button variant="outline" onClick={onClose} px="1.5rem" py="0.75rem" h="44px" fontSize="0.95rem" fontWeight="600" borderRadius="8px" border="2px solid" borderColor="rgba(10, 77, 104, 0.3)" color="primary" _hover={{ bg: "rgba(10, 77, 104, 0.05)", borderColor: "primary" }}>
                            Annuler
                        </Button>
                        <Button bg="primary" color="white" onClick={handleUpdateService} loading={isUpdating} px="1.5rem" py="0.75rem" h="44px" fontSize="0.95rem" fontWeight="600" borderRadius="8px" _hover={{ bg: "rgba(10, 77, 104, 0.9)" }}>
                            Enregistrer
                        </Button>
                    </Flex>
                </Flex>
            </Box>
        </Modal>
    );
};
