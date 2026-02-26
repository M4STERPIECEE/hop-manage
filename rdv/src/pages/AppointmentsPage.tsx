import { Box, Table, Text, Icon, Grid, Flex, Heading, Input, Button, Spinner, chakra } from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiCalendar, FiCheckCircle, FiClock, FiSearch, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useState, useEffect, useCallback } from 'react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import type { Appointment } from '../types';

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
                        <Icon as={FiCalendar} boxSize="1.5rem" color="primary" />
                        <Text fontSize="0.85rem" fontWeight="600" color="rgba(10, 77, 104, 0.7)" textTransform="uppercase" letterSpacing="0.5px">
                            Total RDV
                        </Text>
                    </Flex>
                    <Text fontSize="2rem" fontWeight="700" color="primary" fontFamily="'Crimson Pro', serif" >
                        {appointments.length}
                    </Text>
                </Box>
                <Box bg="white" p="1.5rem" borderRadius="12px" border="1px solid rgba(34, 197, 94, 0.2)" boxShadow="0 2px 8px rgba(34, 197, 94, 0.08)" transition="all 0.3s ease" _hover={{ transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)', }}>
                    <Flex align="center" gap="0.75rem" mb="0.5rem">
                        <Icon as={FiCheckCircle} boxSize="1.5rem" color="#22c55e" />
                        <Text fontSize="0.85rem" fontWeight="600" color="rgba(10, 77, 104, 0.7)" textTransform="uppercase" letterSpacing="0.5px">
                            Confirmés
                        </Text>
                    </Flex>
                    <Text fontSize="2rem" fontWeight="700" color="#22c55e" fontFamily="'Crimson Pro', serif">
                        {confirmedCount}
                    </Text>
                </Box>
                <Box bg="white" p="1.5rem" borderRadius="12px" border="1px solid rgba(251, 191, 36, 0.2)" boxShadow="0 2px 8px rgba(251, 191, 36, 0.08)" transition="all 0.3s ease" _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(251, 191, 36, 0.15)',
                    }}>
                    <Flex align="center" gap="0.75rem" mb="0.5rem">
                        <Icon as={FiClock} boxSize="1.5rem" color="#fbbf24" />
                        <Text
                            fontSize="0.85rem"
                            fontWeight="600"
                            color="rgba(10, 77, 104, 0.7)"
                            textTransform="uppercase"
                            letterSpacing="0.5px"
                        >
                            En attente
                        </Text>
                    </Flex>
                    <Text
                        fontSize="2rem"
                        fontWeight="700"
                        color="#fbbf24"
                        fontFamily="'Crimson Pro', serif"
                    >
                        {pendingCount}
                    </Text>
                </Box>
                <Box
                    bg="white"
                    p="1.5rem"
                    borderRadius="12px"
                    border="1px solid rgba(5, 199, 226, 0.2)"
                    boxShadow="0 2px 8px rgba(5, 199, 226, 0.08)"
                    transition="all 0.3s ease"
                    _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(5, 199, 226, 0.15)',
                    }}
                >
                    <Flex align="center" gap="0.75rem" mb="0.5rem">
                        <Icon as={FiCheck} boxSize="1.5rem" color="accent" />
                        <Text
                            fontSize="0.85rem"
                            fontWeight="600"
                            color="rgba(10, 77, 104, 0.7)"
                            textTransform="uppercase"
                            letterSpacing="0.5px"
                        >
                            Terminés
                        </Text>
                    </Flex>
                    <Text
                        fontSize="2rem"
                        fontWeight="700"
                        color="accent"
                        fontFamily="'Crimson Pro', serif"
                    >
                        {completedCount}
                    </Text>
                </Box>
            </Grid>
            <Box
                bg="white"
                borderRadius="12px"
                p="1.5rem"
                boxShadow="0 2px 12px rgba(10, 77, 104, 0.08)"
                border="1px solid rgba(10, 77, 104, 0.08)"
            >
                <Flex 
                    justify="space-between" 
                    align="center" 
                    mb="1.5rem"
                    flexWrap="wrap"
                    gap="1rem"
                >
                    <Box>
                        <Heading
                            as="h2"
                            fontFamily="'Crimson Pro', serif"
                            fontSize="1.5rem"
                            color="primary"
                            mb="0.25rem"
                            fontWeight="700"
                        >
                            Tous les rendez-vous
                        </Heading>
                        <Text 
                            fontSize="0.85rem" 
                            color="rgba(10, 77, 104, 0.6)"
                            fontWeight="500"
                        >
                            {totalElements} rendez-vous au total
                        </Text>
                    </Box>

                    <Flex gap="0.75rem" align="center" flexWrap="nowrap" w="100%" maxW="550px">
                        <Input
                            placeholder="🔍 Rechercher un patient, service..."
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                            border="2px solid rgba(10, 77, 104, 0.15)"
                            borderRadius="8px"
                            px="1rem"
                            py="0.6rem"
                            fontSize="0.9rem"
                            flex="1"
                            transition="all 0.3s ease"
                            _focus={{
                                borderColor: 'accent',
                                boxShadow: '0 0 0 3px rgba(5, 199, 226, 0.1)',
                                outline: 'none',
                            }}
                            _hover={{
                                borderColor: 'rgba(10, 77, 104, 0.25)',
                            }}
                        />
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            bg="primary"
                            color="white"
                            border="2px solid transparent"
                            px="1.25rem"
                            py="0.6rem"
                            borderRadius="8px"
                            cursor="pointer"
                            fontWeight="600"
                            fontSize="0.9rem"
                            transition="all 0.3s ease"
                            whiteSpace="nowrap"
                            _hover={{
                                bg: 'rgba(10, 77, 104, 0.9)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(10, 77, 104, 0.3)',
                            }}
                        >
                            + Nouveau RDV
                        </Button>
                    </Flex>
                </Flex>
                <Flex gap="0.75rem" mb="1.5rem" flexWrap="wrap">
                    {statusOptions.map((status) => (
                        <Button
                            key={status}
                            onClick={() => handleStatusFilter(status)}
                            bg={statusFilter === status ? 'primary' : 'white'}
                            color={statusFilter === status ? 'white' : 'primary'}
                            border="2px solid"
                            borderColor={statusFilter === status ? 'primary' : 'rgba(10, 77, 104, 0.2)'}
                            px="1rem"
                            py="0.5rem"
                            borderRadius="20px"
                            cursor="pointer"
                            fontWeight="600"
                            fontSize="0.85rem"
                            transition="all 0.3s ease"
                            _hover={{
                                bg: statusFilter === status ? 'rgba(10, 77, 104, 0.9)' : 'rgba(10, 77, 104, 0.05)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 2px 8px rgba(10, 77, 104, 0.15)',
                            }}
                        >
                            {status}
                        </Button>
                    ))}
                </Flex>

                {/* Table */}
                <Box 
                    overflowX="auto"
                    borderRadius="8px"
                    border="1px solid rgba(10, 77, 104, 0.1)"
                    minH="200px"
                    position="relative"
                >
                    {isLoading ? (
                        <Flex justify="center" align="center" py="5rem">
                            <Spinner size="xl" color="primary" />
                        </Flex>
                    ) : (
                        <Table.Root variant="line" size="md">
                            <Table.Header bg="rgba(10, 77, 104, 0.04)">
                                <Table.Row>
                                    <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" py="1rem" px="1.25rem">
                                        Réf
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" py="1rem" px="1.25rem">
                                        Patient
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" py="1rem" px="1.25rem">
                                        Contact
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" py="1rem" px="1.25rem">
                                        Service
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" py="1rem" px="1.25rem">
                                        Date & Heure
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" py="1rem" px="1.25rem">
                                        Statut
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" py="1rem" px="1.25rem">
                                        Actions
                                    </Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {filteredAppointments.map((appointment) => (
                                    <Table.Row
                                        key={appointment.id}
                                        _hover={{ bg: 'rgba(5, 199, 226, 0.04)' }}
                                    >
                                        <Table.Cell py="1rem" px="1.25rem" fontWeight="700" color="rgba(10, 77, 104, 0.5)" fontSize="0.8rem">
                                            {appointment.id.substring(0, 8)}
                                        </Table.Cell>
                                        <Table.Cell py="1rem" px="1.25rem" fontWeight="600" color="primary" fontSize="0.95rem">
                                            {appointment.patient}
                                        </Table.Cell>
                                        <Table.Cell py="1rem" px="1.25rem" color="rgba(10, 77, 104, 0.7)" fontSize="0.9rem">
                                            <Box>
                                                <Text fontSize="0.85rem" mb="0.1rem">{appointment.email}</Text>
                                                <Text fontSize="0.8rem" color="rgba(10, 77, 104, 0.5)">{appointment.phone}</Text>
                                            </Box>
                                        </Table.Cell>
                                        <Table.Cell py="1rem" px="1.25rem" color="rgba(10, 77, 104, 0.8)" fontSize="0.9rem" fontWeight="500">
                                            {appointment.service}
                                        </Table.Cell>
                                        <Table.Cell py="1rem" px="1.25rem" color="rgba(10, 77, 104, 0.7)" fontSize="0.9rem">
                                            <Box>
                                                <Text fontWeight="500">{formatDate(appointment.date)}</Text>
                                                <Text fontSize="0.8rem" color="rgba(10, 77, 104, 0.5)">à {appointment.time}</Text>
                                            </Box>
                                        </Table.Cell>
                                        <Table.Cell py="1rem" px="1.25rem">
                                            <Badge status={appointment.status}>
                                                {appointment.status}
                                            </Badge>
                                        </Table.Cell>
                                         <Table.Cell py="1rem" px="1.25rem">
                                            <Flex gap="0.5rem">
                                                <Box as="button" 
                                                    onClick={() => openEditModal(appointment)}
                                                    bg="rgba(5, 199, 226, 0.1)" color="accent" p="0.5rem" borderRadius="6px" _hover={{ bg: 'rgba(5, 199, 226, 0.2)' }}>
                                                    <Icon as={FiEdit2} />
                                                </Box>
                                                <Box as="button" bg="rgba(220, 38, 38, 0.1)" color="#dc2626" p="0.5rem" borderRadius="6px" _hover={{ bg: 'rgba(220, 38, 38, 0.2)' }}>
                                                    <Icon as={FiTrash2} />
                                                </Box>
                                            </Flex>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    )}
                </Box>
                <Flex justify="center" align="center" gap="1rem" mt="1.5rem">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
                    >
                        <Icon as={FiChevronLeft} />
                    </Button>
                    <Text fontWeight="600" fontSize="0.9rem" color="primary">
                        Page {currentPage + 1} sur {totalPages}
                    </Text>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage >= totalPages - 1}
                        _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
                    >
                        <Icon as={FiChevronRight} />
                    </Button>
                </Flex>
                {!isLoading && filteredAppointments.length === 0 && (
                    <Box textAlign="center" py="4rem">
                        <Icon as={FiSearch} boxSize="3rem" color="rgba(10, 77, 104, 0.1)" mb="1rem" />
                        <Text fontSize="1.1rem" fontWeight="600" color="primary">Aucun rendez-vous trouvé</Text>
                    </Box>
                )}
            </Box>
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedAppointment(null);
                }}
                title={selectedAppointment ? "Modifier le statut" : "Nouveau rendez-vous"}
            >
                {selectedAppointment ? (
                    <Box>
                        <Text mb="1rem" fontWeight="600">Patient: {selectedAppointment.patient}</Text>
                        <Text mb="1.5rem" color="textGray">Statut actuel: <Badge status={selectedAppointment.status}>{selectedAppointment.status}</Badge></Text>
                        
                        <Grid templateColumns="repeat(2, 1fr)" gap="1rem" mb="2rem">
                            {['En attente', 'Confirmé', 'Terminé', 'Annulé'].map((s) => (
                                <Button
                                    key={s}
                                    variant={tempStatus === s ? "solid" : "outline"}
                                    bg={tempStatus === s ? "primary" : "transparent"}
                                    color={tempStatus === s ? "white" : "primary"}
                                    borderColor="primary"
                                    onClick={() => setTempStatus(s)}
                                    disabled={isUpdating}
                                    _hover={{ transform: 'translateY(-1px)', boxShadow: 'sm' }}
                                >
                                    {s}
                                </Button>
                            ))}
                        </Grid>

                        <Button
                            w="100%"
                            bg="primary"
                            color="white"
                            h="3rem"
                            borderRadius="8px"
                            fontWeight="700"
                            onClick={() => handleUpdateStatus(selectedAppointment.id, tempStatus)}
                            loading={isUpdating}
                            disabled={tempStatus === selectedAppointment.status}
                            _hover={{ bg: 'primaryDark' }}
                        >
                            Enregistrer les modifications
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Grid templateColumns="repeat(2, 1fr)" gap="1rem" mb="1.5rem">
                            <Box>
                                <Text mb="0.4rem" fontWeight="600" fontSize="0.9rem">Prénom</Text>
                                <Input 
                                    placeholder="Prénom" 
                                    px="1rem"
                                    h="2.8rem"
                                    border="1px solid rgba(10, 77, 104, 0.2)"
                                    value={newAppointment.firstName}
                                    onChange={(e) => setNewAppointment({...newAppointment, firstName: e.target.value})}
                                />
                            </Box>
                            <Box>
                                <Text mb="0.4rem" fontWeight="600" fontSize="0.9rem">Nom</Text>
                                <Input 
                                    placeholder="Nom"
                                    px="1rem"
                                    h="2.8rem"
                                    border="1px solid rgba(10, 77, 104, 0.2)"
                                    value={newAppointment.lastName}
                                    onChange={(e) => setNewAppointment({...newAppointment, lastName: e.target.value})}
                                />
                            </Box>
                        </Grid>
                        <Grid templateColumns="repeat(2, 1fr)" gap="1rem" mb="1.5rem">
                            <Box>
                                <Text mb="0.4rem" fontWeight="600" fontSize="0.9rem">Email</Text>
                                <Input 
                                    type="email" 
                                    placeholder="Email"
                                    px="1rem"
                                    h="2.8rem"
                                    border="1px solid rgba(10, 77, 104, 0.2)"
                                    value={newAppointment.email}
                                    onChange={(e) => setNewAppointment({...newAppointment, email: e.target.value})}
                                />
                            </Box>
                            <Box>
                                <Text mb="0.4rem" fontWeight="600" fontSize="0.9rem">Téléphone</Text>
                                <Input 
                                    placeholder="Téléphone"
                                    px="1rem"
                                    h="2.8rem"
                                    border="1px solid rgba(10, 77, 104, 0.2)"
                                    value={newAppointment.phone}
                                    onChange={(e) => setNewAppointment({...newAppointment, phone: e.target.value})}
                                />
                            </Box>
                        </Grid>
                        <Box mb="1.5rem">
                            <Text mb="0.4rem" fontWeight="600" fontSize="0.9rem">Service</Text>
                            <chakra.select
                                w="100%"
                                h="2.8rem"
                                border="1px solid rgba(10, 77, 104, 0.2)"
                                borderRadius="6px"
                                px="1rem"
                                value={newAppointment.service}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewAppointment({...newAppointment, service: e.target.value})}
                            >
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
                                <Input 
                                    type="date"
                                    px="1rem"
                                    h="2.8rem"
                                    border="1px solid rgba(10, 77, 104, 0.2)"
                                    value={newAppointment.date}
                                    onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                                />
                            </Box>
                            <Box>
                                <Text mb="0.4rem" fontWeight="600" fontSize="0.9rem">Heure</Text>
                                <Input 
                                    type="time"
                                    px="1rem"
                                    h="2.8rem"
                                    border="1px solid rgba(10, 77, 104, 0.2)"
                                    value={newAppointment.time}
                                    onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                                />
                            </Box>
                        </Grid>
                        <Button
                            w="100%"
                            bg="primary"
                            color="white"
                            h="3rem"
                            borderRadius="8px"
                            fontWeight="700"
                            onClick={handleCreateAppointment}
                            loading={isUpdating}
                            disabled={!newAppointment.firstName || !newAppointment.lastName || !newAppointment.date || !newAppointment.time}
                            _hover={{ bg: 'primaryDark' }}
                        >
                            Créer le rendez-vous
                        </Button>
                    </Box>
                )}
            </Modal>
            {showSuccessToast && (
                <Flex
                    position="fixed"
                    bottom="2rem"
                    left="50%"
                    transform="translateX(-50%)"
                    bg="rgba(16, 185, 129, 0.95)"
                    color="white"
                    py="1rem"
                    px="2rem"
                    borderRadius="12px"
                    boxShadow="0 10px 25px rgba(16, 185, 129, 0.3)"
                    align="center"
                    gap="0.75rem"
                    zIndex="3000"
                    css={{
                        animation: 'fadeInUp 0.4s ease-out'
                    }}
                >
                    <Icon as={FiCheck} boxSize="1.2rem" />
                    <Text fontWeight="600">Statut mis à jour avec succès !</Text>
                </Flex>
            )}
        </Box>
    );
};