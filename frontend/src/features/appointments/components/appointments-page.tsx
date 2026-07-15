import { Box, Table, Text, Icon, Grid, Flex, Button } from '@chakra-ui/react';
import { Pencil, Trash2, Calendar, CheckCircle, Clock, Check } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Badge } from '../../../shared/ui/badge';
import { AppointmentModal } from './modals/appointment-modal';
import type { Appointment } from '../../../shared/model';
import { DataTable } from '../../../shared/ui/data-table';

export const AppointmentsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('Tous');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [tempStatus, setTempStatus] = useState<string>('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        service: 'Consultation générale'
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';

    const fetchAppointments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiBase}/appointments?page=${currentPage}&size=5`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            const content = data.content || data;
            const meta = data.totalPages !== undefined ? data : { totalPages: 1, totalElements: content.length };
            const mapped: Appointment[] = content.map((app: {
                id: string;
                appointmentDate: string;
                status: Appointment['status'];
                user?: { firstName: string; lastName: string; email: string; phone: string };
                service?: { name: string };
            }) => {
                const dateStr = app.appointmentDate || '';
                const dateObj = dateStr ? new Date(dateStr) : new Date();
                return {
                    id: app.id || '',
                    patient: app.user ? `${app.user.firstName} ${app.user.lastName}` : 'Inconnu',
                    email: app.user ? app.user.email : '',
                    phone: app.user ? app.user.phone : '',
                    service: app.service ? app.service.name : 'Service inconnu',
                    date: dateStr ? dateStr.split('T')[0] : '',
                    time: dateStr ? dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
                    status: app.status || 'En attente'
                };
            });

            setAppointments(mapped);
            setFilteredAppointments(mapped);
            setTotalPages(meta.totalPages);
            setTotalElements(meta.totalElements);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setIsLoading(false);
        }
    }, [apiBase, currentPage]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        setIsUpdating(true);
        try {
            const response = await fetch(`${apiBase}/appointments/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update status');
            fetchAppointments();
            setIsModalOpen(false);
            setSelectedAppointment(null);
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 4000);
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const openEditModal = (app: Appointment) => {
        setSelectedAppointment(app);
        setTempStatus(app.status);
        setIsModalOpen(true);
    };

    const handleCreateAppointment = async () => {
        setIsUpdating(true);
        try {
            const response = await fetch(`${apiBase}/appointments/public`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAppointment),
            });

            if (!response.ok) throw new Error('Failed to create appointment');

            fetchAppointments();
            setIsModalOpen(false);
            setNewAppointment({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                date: '',
                time: '',
                service: 'Consultation générale'
            });
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 4000);
        } catch (error) {
            console.error('Error creating appointment:', error);
        } finally {
            setIsUpdating(false);
        }
    };
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const handleSearch = (value: string) => {
        setSearchValue(value);
        applyFilters(value, statusFilter, appointments);
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        applyFilters(searchValue, status, appointments);
    };

    const applyFilters = (search: string, status: string, allApps: Appointment[]) => {
        let filtered = allApps;
        if (search) {
            filtered = filtered.filter(
                (app) =>
                    app.patient.toLowerCase().includes(search.toLowerCase()) ||
                    app.email.toLowerCase().includes(search.toLowerCase()) ||
                    app.service.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (status !== 'Tous') {
            filtered = filtered.filter((app) => app.status === status);
        }

        setFilteredAppointments(filtered);
    };

    const confirmedCount = appointments.filter(app => app.status === 'Confirmé' || app.status === 'CONFIRMED').length;
    const pendingCount = appointments.filter(app => app.status === 'En attente' || app.status === 'PENDING').length;
    const completedCount = appointments.filter(app => app.status === 'Terminé' || app.status === 'COMPLETED').length;

    const statusOptions = ['Tous', 'Confirmé', 'En attente', 'Terminé', 'Annulé'];

    return (
        <Box>
            <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap="1.25rem" mb="2rem">
                <Box bg="white" p="1.5rem" borderRadius="12px" border="1px solid rgba(10, 77, 104, 0.1)" boxShadow="0 2px 8px rgba(10, 77, 104, 0.06)" transition="all 0.3s ease" _hover={{ transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(10, 77, 104, 0.12)', }}>
                    <Flex align="center" gap="0.75rem" mb="0.5rem">
                        <Icon as={Calendar} boxSize="1.5rem" color="primary" />
                        <Text fontSize="0.85rem" fontWeight="600" color="rgba(10, 77, 104, 0.7)" textTransform="uppercase" letterSpacing="0.5px">
                            Total RDV
                        </Text>
                    </Flex>
                    <Text fontSize="2rem" fontWeight="700" color="primary" fontFamily="'Poppins', sans-serif" >
                        {appointments.length}
                    </Text>
                </Box>
                <Box bg="white" p="1.5rem" borderRadius="12px" border="1px solid rgba(34, 197, 94, 0.2)" boxShadow="0 2px 8px rgba(34, 197, 94, 0.08)" transition="all 0.3s ease" _hover={{ transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)', }}>
                    <Flex align="center" gap="0.75rem" mb="0.5rem">
                        <Icon as={CheckCircle} boxSize="1.5rem" color="#22c55e" />
                        <Text fontSize="0.85rem" fontWeight="600" color="rgba(10, 77, 104, 0.7)" textTransform="uppercase" letterSpacing="0.5px">
                            Confirmés
                        </Text>
                    </Flex>
                    <Text fontSize="2rem" fontWeight="700" color="#22c55e" fontFamily="'Poppins', sans-serif">
                        {confirmedCount}
                    </Text>
                </Box>
                <Box bg="white" p="1.5rem" borderRadius="12px" border="1px solid rgba(251, 191, 36, 0.2)" boxShadow="0 2px 8px rgba(251, 191, 36, 0.08)" transition="all 0.3s ease" _hover={{ transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(251, 191, 36, 0.15)', }}>
                    <Flex align="center" gap="0.75rem" mb="0.5rem">
                        <Icon as={Clock} boxSize="1.5rem" color="#fbbf24" />
                        <Text fontSize="0.85rem" fontWeight="600" color="rgba(10, 77, 104, 0.7)" textTransform="uppercase" letterSpacing="0.5px">En attente</Text>
                    </Flex>
                    <Text fontSize="2rem" fontWeight="700" color="#fbbf24" fontFamily="'Poppins', sans-serif">{pendingCount}</Text>
                </Box>
                <Box bg="white" p="1.5rem" borderRadius="12px" border="1px solid rgba(5, 199, 226, 0.2)" boxShadow="0 2px 8px rgba(5, 199, 226, 0.08)" transition="all 0.3s ease" _hover={{ transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(5, 199, 226, 0.15)', }}>
                    <Flex align="center" gap="0.75rem" mb="0.5rem">
                        <Icon as={Check} boxSize="1.5rem" color="accent" />
                        <Text fontSize="0.85rem" fontWeight="600" color="rgba(10, 77, 104, 0.7)" textTransform="uppercase" letterSpacing="0.5px">Terminés</Text>
                    </Flex>
                    <Text fontSize="2rem" fontWeight="700" color="accent" fontFamily="'Poppins', sans-serif">{completedCount}</Text>
                </Box>
            </Grid>
            <DataTable
                title="Tous les rendez-vous"
                subtitle={`${totalElements} rendez-vous au total`}
                onAdd={() => setIsModalOpen(true)}
                addButtonText="Nouveau RDV"
                searchPlaceholder="Rechercher un patient, service..."
                searchValue={searchValue}
                onSearch={handleSearch}
                filters={
                    <Flex gap="0.75rem" flexWrap="wrap">
                        {statusOptions.map((status) => (
                            <Button key={status} onClick={() => handleStatusFilter(status)} bg={statusFilter === status ? 'primary' : 'white'} color={statusFilter === status ? 'white' : 'primary'} border="2px solid" borderColor={statusFilter === status ? 'primary' : 'rgba(10, 77, 104, 0.2)'} px="1rem" py="0.5rem" borderRadius="20px" cursor="pointer" fontWeight="600" fontSize="0.85rem" transition="all 0.3s ease" _hover={{ bg: statusFilter === status ? 'rgba(10, 77, 104, 0.9)' : 'rgba(10, 77, 104, 0.05)', transform: 'translateY(-2px)', boxShadow: '0 2px 8px rgba(10, 77, 104, 0.15)' }}>
                                {status}
                            </Button>
                        ))}
                    </Flex>
                }
                isLoading={isLoading}
                isEmpty={!isLoading && filteredAppointments.length === 0}
                emptyMessage="Aucun rendez-vous trouvé"
                emptySubMessage=""
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            >
                <Table.Root variant="line" size="md">
                    <Table.Header bg="rgba(10, 77, 104, 0.04)">
                        <Table.Row>
                            <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" py="1rem" px="1.25rem">Réf</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" py="1rem" px="1.25rem">Patient</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" py="1rem" px="1.25rem">Contact</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" py="1rem" px="1.25rem">Service</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" py="1rem" px="1.25rem">Date & Heure</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" py="1rem" px="1.25rem">Statut</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" py="1rem" px="1.25rem">Actions</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {filteredAppointments.map((appointment) => (
                            <Table.Row key={appointment.id} _hover={{ bg: 'rgba(5, 199, 226, 0.04)' }}>
                                <Table.Cell py="1rem" px="1.25rem" fontWeight="700" color="rgba(10, 77, 104, 0.5)" fontSize="0.8rem">{appointment.id.substring(0, 8)}</Table.Cell>
                                <Table.Cell py="1rem" px="1.25rem" fontWeight="600" color="primary" fontSize="0.95rem">{appointment.patient}</Table.Cell>
                                <Table.Cell py="1rem" px="1.25rem" color="rgba(10, 77, 104, 0.7)" fontSize="0.9rem">
                                    <Box>
                                        <Text fontSize="0.85rem" mb="0.1rem">{appointment.email}</Text>
                                        <Text fontSize="0.8rem" color="rgba(10, 77, 104, 0.5)">{appointment.phone}</Text>
                                    </Box>
                                </Table.Cell>
                                <Table.Cell py="1rem" px="1.25rem" color="rgba(10, 77, 104, 0.8)" fontSize="0.9rem" fontWeight="500">{appointment.service}</Table.Cell>
                                <Table.Cell py="1rem" px="1.25rem" color="rgba(10, 77, 104, 0.7)" fontSize="0.9rem">
                                    <Box>
                                        <Text fontWeight="500">{formatDate(appointment.date)}</Text>
                                        <Text fontSize="0.8rem" color="rgba(10, 77, 104, 0.5)">à {appointment.time}</Text>
                                    </Box>
                                </Table.Cell>
                                <Table.Cell py="1rem" px="1.25rem">
                                    <Badge status={appointment.status}>{appointment.status}</Badge>
                                </Table.Cell>
                                <Table.Cell py="1rem" px="1.25rem">
                                    <Flex gap="0.5rem">
                                        <Box as="button" onClick={() => openEditModal(appointment)} bg="rgba(5, 199, 226, 0.1)" color="accent" p="0.5rem" borderRadius="6px" _hover={{ bg: 'rgba(5, 199, 226, 0.2)' }}>
                                            <Icon as={Pencil} />
                                        </Box>
                                        <Box as="button" bg="rgba(220, 38, 38, 0.1)" color="#dc2626" p="0.5rem" borderRadius="6px" _hover={{ bg: 'rgba(220, 38, 38, 0.2)' }}>
                                            <Icon as={Trash2} />
                                        </Box>
                                    </Flex>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </DataTable>
            <AppointmentModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedAppointment(null); }}
                selectedAppointment={selectedAppointment}
                tempStatus={tempStatus}
                setTempStatus={setTempStatus}
                isUpdating={isUpdating}
                handleUpdateStatus={handleUpdateStatus}
                newAppointment={newAppointment}
                setNewAppointment={setNewAppointment}
                handleCreateAppointment={handleCreateAppointment}
            />
            {showSuccessToast && (
                <Flex position="fixed" bottom="2rem" left="50%" transform="translateX(-50%)" bg="rgba(16, 185, 129, 0.95)" color="white" py="1rem" px="2rem" borderRadius="12px" boxShadow="0 10px 25px rgba(16, 185, 129, 0.3)" align="center" gap="0.75rem" zIndex="3000" css={{ animation: 'fadeInUp 0.4s ease-out' }}>
                    <Icon as={Check} boxSize="1.2rem" />
                    <Text fontWeight="600">Statut mis à jour avec succès !</Text>
                </Flex>
            )}
        </Box>
    );
};