import { Box, Grid, Text, Button, Input, chakra } from '@chakra-ui/react';
import { Badge } from '../../../../shared/ui/badge';
import { Modal } from '../../../../shared/ui/modal';
import type { Appointment } from '../../../../shared/model';

interface NewAppointment {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    service: string;
}

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedAppointment: Appointment | null;
    tempStatus: string;
    setTempStatus: (status: string) => void;
    isUpdating: boolean;
    handleUpdateStatus: (id: string, status: string) => void;
    newAppointment: NewAppointment;
    setNewAppointment: React.Dispatch<React.SetStateAction<NewAppointment>>;
    handleCreateAppointment: () => void;
}

export const AppointmentModal = ({
    isOpen,
    onClose,
    selectedAppointment,
    tempStatus,
    setTempStatus,
    isUpdating,
    handleUpdateStatus,
    newAppointment,
    setNewAppointment,
    handleCreateAppointment
}: AppointmentModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={selectedAppointment ? "Modifier le statut" : "Nouveau rendez-vous"}>
            {selectedAppointment ? (
                <Box>
                    <Text mb="1rem" fontWeight="600">Patient: {selectedAppointment.patient}</Text>
                    <Text mb="1.5rem" color="textGray">Statut actuel: <Badge status={selectedAppointment.status}>{selectedAppointment.status}</Badge></Text>

                    <Grid templateColumns="repeat(2, 1fr)" gap="1rem" mb="2rem">
                        {['En attente', 'Confirmé', 'Terminé', 'Annulé'].map((s) => (
                            <Button key={s} variant={tempStatus === s ? "solid" : "outline"} bg={tempStatus === s ? "primary" : "transparent"} color={tempStatus === s ? "white" : "primary"} borderColor="primary" onClick={() => setTempStatus(s)} disabled={isUpdating} _hover={{ transform: 'translateY(-1px)', boxShadow: 'sm' }}>
                                {s}
                            </Button>
                        ))}
                    </Grid>

                    <Button w="100%" bg="primary" color="white" h="3rem" borderRadius="8px" fontWeight="700" onClick={() => handleUpdateStatus(selectedAppointment.id, tempStatus)} loading={isUpdating} disabled={tempStatus === selectedAppointment.status} _hover={{ bg: 'primaryDark' }}>
                        Enregistrer les modifications
                    </Button>
                </Box>
            ) : (
                <Box>
                    <Grid templateColumns="repeat(2, 1fr)" gap="1rem" mb="1.5rem">
                        <Box>
                            <Text mb="0.4rem" fontWeight="600" fontSize="0.9rem">Prénom</Text>
                            <Input placeholder="Prénom" px="1rem" h="2.8rem" border="1px solid rgba(10, 77, 104, 0.2)" value={newAppointment.firstName} onChange={(e) => setNewAppointment({ ...newAppointment, firstName: e.target.value })} />
                        </Box>
                        <Box>
                            <Text mb="0.4rem" fontWeight="600" fontSize="0.9rem">Nom</Text>
                            <Input placeholder="Nom" px="1rem" h="2.8rem" border="1px solid rgba(10, 77, 104, 0.2)" value={newAppointment.lastName} onChange={(e) => setNewAppointment({ ...newAppointment, lastName: e.target.value })} />
                        </Box>
                    </Grid>
                    <Grid templateColumns="repeat(2, 1fr)" gap="1rem" mb="1.5rem">
                        <Box>
                            <Text mb="0.4rem" fontWeight="600" fontSize="0.9rem">Email</Text>
                            <Input type="email" placeholder="Email" px="1rem" h="2.8rem" border="1px solid rgba(10, 77, 104, 0.2)" value={newAppointment.email} onChange={(e) => setNewAppointment({ ...newAppointment, email: e.target.value })} />
                        </Box>
                        <Box>
                            <Text mb="0.4rem" fontWeight="600" fontSize="0.9rem">Téléphone</Text>
                            <Input placeholder="Téléphone" px="1rem" h="2.8rem" border="1px solid rgba(10, 77, 104, 0.2)" value={newAppointment.phone} onChange={(e) => setNewAppointment({ ...newAppointment, phone: e.target.value })} />
                        </Box>
                    </Grid>
                    <Box mb="1.5rem">
                        <Text mb="0.4rem" fontWeight="600" fontSize="0.9rem">Service</Text>
                        <chakra.select w="100%" h="2.8rem" border="1px solid rgba(10, 77, 104, 0.2)" borderRadius="6px" px="1rem" value={newAppointment.service} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewAppointment({ ...newAppointment, service: e.target.value })}>
                            <option value="Consultation générale">Consultation générale</option>
                            <option value="Détartrage">Détartrage</option>
                            <option value="Blanchiment">Blanchiment</option>
                            <option value="Implant dentaire">Implant dentaire</option>
                            <option value="Orthodontie">Orthodontie</option>
                            <option value="Urgence">Urgence</option>
                        </chakra.select>
                    </Box>
                    <Grid templateColumns="repeat(2, 1fr)" gap="1rem" mb="2rem">
                        <Box>
                            <Text mb="0.4rem" fontWeight="600" fontSize="0.9rem">Date</Text>
                            <Input type="date" px="1rem" h="2.8rem" border="1px solid rgba(10, 77, 104, 0.2)" value={newAppointment.date} onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })} />
                        </Box>
                        <Box>
                            <Text mb="0.4rem" fontWeight="600" fontSize="0.9rem">Heure</Text>
                            <Input type="time" px="1rem" h="2.8rem" border="1px solid rgba(10, 77, 104, 0.2)" value={newAppointment.time} onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })} />
                        </Box>
                    </Grid>
                    <Button w="100%" bg="primary" color="white" h="3rem" borderRadius="8px" fontWeight="700" onClick={handleCreateAppointment} loading={isUpdating} disabled={!newAppointment.firstName || !newAppointment.lastName || !newAppointment.date || !newAppointment.time} _hover={{ bg: 'primaryDark' }}>
                        Créer le rendez-vous
                    </Button>
                </Box>
            )}
        </Modal>
    );
};
