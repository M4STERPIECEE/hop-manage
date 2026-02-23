import { Box, Table, Icon, Grid, Flex, Heading, Text, Button, Input, Spinner } from '@chakra-ui/react';
import { toaster } from '../components/ui/toaster';
import { FiEdit2, FiCheckCircle, FiClock, FiDollarSign } from 'react-icons/fi';
import { GiTooth } from 'react-icons/gi';
import { useEffect, useState } from 'react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { API_ENDPOINTS } from '../config/api';

type ServiceApi = {
    id: string;
    name: string;
    description?: string | null;
    durationMinutes: number;
    price: number;
    status?: 'Actif' | 'Inactif' | string | null;
};

export const ServicesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<string>('Tous');
    const [servicesData, setServicesData] = useState<ServiceApi[]>([]);
    const [filteredServices, setFilteredServices] = useState<ServiceApi[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<ServiceApi | null>(null);
    const [editForm, setEditForm] = useState({
        durationMinutes: '',
        price: '',
        status: 'Actif',
    });
    const [isUpdating, setIsUpdating] = useState(false);

    const totalServices = servicesData.length;
    const activeServices = servicesData.filter(s => (s.status || 'Actif') === 'Actif').length;
    const totalDuration = servicesData.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const avgDuration = totalServices > 0 ? Math.round(totalDuration / totalServices) : 0;
    const totalPrice = servicesData.reduce((acc, s) => acc + (Number(s.price) || 0), 0);
    const avgPrice = totalServices > 0 ? Math.round(totalPrice / totalServices) : 0;
    const formatPrice = (value: number) => new Intl.NumberFormat('fr-MG', {
        style: 'currency',
        currency: 'MGA',
        maximumFractionDigits: 0,
    }).format(value);

    const categories = ['Tous', 'Consultation', 'Nettoyage', 'Esthétique', 'Chirurgie'];

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (categoryFilter === 'Tous') {
            setFilteredServices(servicesData);
            return;
        }

        const filtered = servicesData.filter(s =>
            s.name.toLowerCase().includes(categoryFilter.toLowerCase())
        );
        setFilteredServices(filtered.length > 0 ? filtered : servicesData);
    }, [categoryFilter, servicesData]);

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.services);
            if (!response.ok) throw new Error('Failed to fetch services');
            const data = await response.json();
            const mapped: ServiceApi[] = (Array.isArray(data) ? data : []).map((service: {
                id: string;
                name: string;
                description?: string | null;
                durationMinutes?: number;
                duration?: number;
                price: number;
                status?: string | null;
            }) => ({
                id: service.id,
                name: service.name,
                description: service.description ?? null,
                durationMinutes: Number(service.durationMinutes ?? service.duration) || 0,
                price: Number(service.price) || 0,
                status: service.status ?? 'Actif',
            }));
            setServicesData(mapped);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryFilter = (category: string) => {
        setCategoryFilter(category);
    };

    const openEditModal = (service: ServiceApi) => {
        setSelectedService(service);
        setEditForm({
            durationMinutes: String(service.durationMinutes ?? ''),
            price: String(service.price ?? ''),
            status: service.status ?? 'Actif',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedService(null);
    };

    const handleUpdateService = async () => {
        if (!selectedService) return;

        const durationMinutes = Number(editForm.durationMinutes);
        const price = Number(editForm.price);
        if (!durationMinutes || !price) return;

        setIsUpdating(true);
        try {
            const response = await fetch(`${API_ENDPOINTS.services}/${selectedService.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    durationMinutes,
                    price,
                    status: editForm.status,
                }),
            });

            if (!response.ok) throw new Error('Failed to update service');
            await fetchServices();
            closeModal();
            toaster.create({
                title: 'Succès',
                description: 'Le service a été modifié avec succès',
                type: 'success',
            });
        } catch (error) {
            console.error('Error updating service:', error);
            toaster.create({
                title: 'Erreur',
                description: 'Échec de la modification du service',
                type: 'error',
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Box>
            <Grid
                templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
                gap="1.25rem"
                mb="2rem"
            >
                <Box
                    bg="white"
                    p="1.5rem"
                    borderRadius="12px"
                    border="1px solid rgba(10, 77, 104, 0.1)"
                    boxShadow="0 2px 8px rgba(10, 77, 104, 0.06)"
                    transition="all 0.3s ease"
                    _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(10, 77, 104, 0.12)',
                    }}
                >
                    <Flex align="center" gap="0.75rem" mb="0.5rem">
                        <Box fontSize="2rem" color="accent">
                            <Icon as={GiTooth} />
                        </Box>
                        <Text
                            fontSize="0.85rem"
                            fontWeight="600"
                            color="rgba(10, 77, 104, 0.7)"
                            textTransform="uppercase"
                            letterSpacing="0.5px"
                        >
                            Total Services
                        </Text>
                    </Flex>
                    <Text
                        fontSize="2rem"
                        fontWeight="700"
                        color="primary"
                        fontFamily="'Crimson Pro', serif"
                    >
                        {totalServices}
                    </Text>
                </Box>

                <Box
                    bg="white"
                    p="1.5rem"
                    borderRadius="12px"
                    border="1px solid rgba(34, 197, 94, 0.2)"
                    boxShadow="0 2px 8px rgba(34, 197, 94, 0.08)"
                    transition="all 0.3s ease"
                    _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)',
                    }}
                >
                    <Flex align="center" gap="0.75rem" mb="0.5rem">
                        <Box fontSize="2rem" color="#22c55e">
                            <Icon as={FiCheckCircle} />
                        </Box>
                        <Text
                            fontSize="0.85rem"
                            fontWeight="600"
                            color="rgba(10, 77, 104, 0.7)"
                            textTransform="uppercase"
                            letterSpacing="0.5px"
                        >
                            Services Actifs
                        </Text>
                    </Flex>
                    <Text
                        fontSize="2rem"
                        fontWeight="700"
                        color="#22c55e"
                        fontFamily="'Crimson Pro', serif"
                    >
                        {activeServices}
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
                        <Box fontSize="2rem" color="accent">
                            <Icon as={FiClock} />
                        </Box>
                        <Text
                            fontSize="0.85rem"
                            fontWeight="600"
                            color="rgba(10, 77, 104, 0.7)"
                            textTransform="uppercase"
                            letterSpacing="0.5px"
                        >
                            Durée Moyenne
                        </Text>
                    </Flex>
                    <Text
                        fontSize="2rem"
                        fontWeight="700"
                        color="accent"
                        fontFamily="'Crimson Pro', serif"
                    >
                        {avgDuration} min
                    </Text>
                </Box>

                <Box
                    bg="white"
                    p="1.5rem"
                    borderRadius="12px"
                    border="1px solid rgba(251, 191, 36, 0.2)"
                    boxShadow="0 2px 8px rgba(251, 191, 36, 0.08)"
                    transition="all 0.3s ease"
                    _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(251, 191, 36, 0.15)',
                    }}
                >
                    <Flex align="center" gap="0.75rem" mb="0.5rem">
                        <Box fontSize="2rem" color="#fbbf24">
                            <Icon as={FiDollarSign} />
                        </Box>
                        <Text
                            fontSize="0.85rem"
                            fontWeight="600"
                            color="rgba(10, 77, 104, 0.7)"
                            textTransform="uppercase"
                            letterSpacing="0.5px"
                        >
                            Prix Moyen
                        </Text>
                    </Flex>
                    <Text
                        fontSize="2rem"
                        fontWeight="700"
                        color="#fbbf24"
                        fontFamily="'Crimson Pro', serif"
                    >
                        {formatPrice(avgPrice)}
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
                            Services disponibles
                        </Heading>
                        <Text 
                            fontSize="0.85rem" 
                            color="rgba(10, 77, 104, 0.6)"
                            fontWeight="500"
                        >
                            {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} disponible{filteredServices.length > 1 ? 's' : ''}
                        </Text>
                    </Box>
                </Flex>

                <Flex gap="0.75rem" mb="1.5rem" flexWrap="wrap">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            onClick={() => handleCategoryFilter(category)}
                            bg={categoryFilter === category ? 'primary' : 'white'}
                            color={categoryFilter === category ? 'white' : 'primary'}
                            border="2px solid"
                            borderColor={categoryFilter === category ? 'primary' : 'rgba(10, 77, 104, 0.2)'}
                            px="1rem"
                            py="0.5rem"
                            borderRadius="20px"
                            cursor="pointer"
                            fontWeight="600"
                            fontSize="0.85rem"
                            transition="all 0.3s ease"
                            _hover={{
                                bg: categoryFilter === category ? 'rgba(10, 77, 104, 0.9)' : 'rgba(10, 77, 104, 0.05)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 2px 8px rgba(10, 77, 104, 0.15)',
                            }}
                        >
                            {category}
                        </Button>
                    ))}
                </Flex>
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
                                    <Table.ColumnHeader
                                        fontWeight="700"
                                        fontSize="0.85rem"
                                        color="primary"
                                        textTransform="uppercase"
                                        letterSpacing="0.5px"
                                        py="1rem"
                                        px="1.25rem"
                                        minW="250px"
                                    >
                                        Service
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader
                                        fontWeight="700"
                                        fontSize="0.85rem"
                                        color="primary"
                                        textTransform="uppercase"
                                        letterSpacing="0.5px"
                                        py="1rem"
                                        px="1.25rem"
                                    >
                                        Durée
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader
                                        fontWeight="700"
                                        fontSize="0.85rem"
                                        color="primary"
                                        textTransform="uppercase"
                                        letterSpacing="0.5px"
                                        py="1rem"
                                        px="1.25rem"
                                    >
                                        Prix
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader
                                        fontWeight="700"
                                        fontSize="0.85rem"
                                        color="primary"
                                        textTransform="uppercase"
                                        letterSpacing="0.5px"
                                        py="1rem"
                                        px="1.25rem"
                                    >
                                        Statut
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader
                                        fontWeight="700"
                                        fontSize="0.85rem"
                                        color="primary"
                                        textTransform="uppercase"
                                        letterSpacing="0.5px"
                                        py="1rem"
                                        px="1.25rem"
                                    >
                                        Actions
                                    </Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {filteredServices.map((service, index) => (
                                    <Table.Row
                                        key={service.id}
                                        _hover={{ 
                                            bg: 'rgba(5, 199, 226, 0.04)',
                                            transition: 'all 0.2s ease'
                                        }}
                                        borderBottom={
                                            index === filteredServices.length - 1 
                                                ? 'none' 
                                                : '1px solid rgba(10, 77, 104, 0.08)'
                                        }
                                    >
                                        <Table.Cell 
                                            py="1rem" 
                                            px="1.25rem"
                                            fontWeight="600"
                                            color="primary"
                                            fontSize="0.95rem"
                                        >
                                            <Flex align="center" gap="0.75rem">
                                                <Box
                                                    bg="rgba(5, 199, 226, 0.1)"
                                                    borderRadius="8px"
                                                    p="0.5rem"
                                                    fontSize="1.25rem"
                                                    color="accent"
                                                >
                                                    <Icon as={GiTooth} />
                                                </Box>
                                                {service.name}
                                            </Flex>
                                        </Table.Cell>
                                        <Table.Cell 
                                            py="1rem" 
                                            px="1.25rem"
                                            color="rgba(10, 77, 104, 0.8)"
                                            fontSize="0.9rem"
                                        >
                                            <Flex align="center" gap="0.5rem">
                                                <Box fontSize="0.9rem" color="accent">
                                                    <Icon as={FiClock} />
                                                </Box>
                                                <Text fontWeight="500">{service.durationMinutes} min</Text>
                                            </Flex>
                                        </Table.Cell>
                                        <Table.Cell 
                                            py="1rem" 
                                            px="1.25rem"
                                            color="primary"
                                            fontSize="0.95rem"
                                            fontWeight="700"
                                        >
                                            {formatPrice(service.price)}
                                        </Table.Cell>
                                        <Table.Cell py="1rem" px="1.25rem">
                                            <Badge status={(service.status as 'Actif' | 'Inactif') || 'Actif'}>
                                                {service.status || 'Actif'}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell py="1rem" px="1.25rem">
                                            <Box
                                                as="button"
                                                bg="rgba(5, 199, 226, 0.1)"
                                                border="1px solid rgba(5, 199, 226, 0.2)"
                                                cursor="pointer"
                                                p="0.5rem"
                                                borderRadius="6px"
                                                transition="all 0.3s ease"
                                                color="accent"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                _hover={{ 
                                                    bg: 'rgba(5, 199, 226, 0.2)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 2px 8px rgba(5, 199, 226, 0.3)'
                                                }}
                                                title="Modifier"
                                                onClick={() => openEditModal(service)}
                                            >
                                                <Icon as={FiEdit2} boxSize="1.1rem" />
                                            </Box>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    )}
                </Box>
            </Box>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Modifier le service"
            >
                <Box>
                    <Flex direction="column" gap="1.25rem">
                        <Box>
                            <Text mb="0.5rem" fontWeight="600" color="primary" fontSize="0.9rem">Duree (minutes)</Text>
                            <Input
                                type="number"
                                value={editForm.durationMinutes}
                                onChange={(e) => setEditForm(prev => ({ ...prev, durationMinutes: e.target.value }))}
                                placeholder="Ex: 45"
                                size="lg"
                                px="1rem"
                                py="0.75rem"
                                h="48px"
                                fontSize="1rem"
                                borderRadius="8px"
                                border="2px solid"
                                borderColor="rgba(10, 77, 104, 0.2)"
                                _focus={{
                                    borderColor: "accent",
                                    boxShadow: "0 0 0 1px var(--colors-accent)",
                                }}
                            />
                        </Box>
                        <Box>
                            <Text mb="0.5rem" fontWeight="600" color="primary" fontSize="0.9rem">Prix (MGA)</Text>
                            <Input
                                type="number"
                                value={editForm.price}
                                onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                                placeholder="Ex: 80000"
                                size="lg"
                                px="1rem"
                                py="0.75rem"
                                h="48px"
                                fontSize="1rem"
                                borderRadius="8px"
                                border="2px solid"
                                borderColor="rgba(10, 77, 104, 0.2)"
                                _focus={{
                                    borderColor: "accent",
                                    boxShadow: "0 0 0 1px var(--colors-accent)",
                                }}
                            />
                        </Box>
                        <Box>
                            <Text mb="0.5rem" fontWeight="600" color="primary" fontSize="0.9rem">Statut</Text>
                            <select
                                style={{
                                    width: '100%',
                                    height: '48px',
                                    padding: '0 2.5rem 0 1rem',
                                    fontSize: '1rem',
                                    borderRadius: '8px',
                                    border: '2px solid rgba(10, 77, 104, 0.2)',
                                    outline: 'none',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                }}
                                value={editForm.status}
                                onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                            >
                                <option value="Actif">Actif</option>
                                <option value="Inactif">Inactif</option>
                            </select>
                        </Box>
                        <Flex justify="flex-end" gap="1rem" mt="1.5rem">
                            <Button 
                                variant="outline" 
                                onClick={closeModal}
                                px="1.5rem"
                                py="0.75rem"
                                h="44px"
                                fontSize="0.95rem"
                                fontWeight="600"
                                borderRadius="8px"
                                border="2px solid"
                                borderColor="rgba(10, 77, 104, 0.3)"
                                color="primary"
                                _hover={{
                                    bg: "rgba(10, 77, 104, 0.05)",
                                    borderColor: "primary",
                                }}
                            >
                                Annuler
                            </Button>
                            <Button
                                bg="primary"
                                color="white"
                                onClick={handleUpdateService}
                                loading={isUpdating}
                                px="1.5rem"
                                py="0.75rem"
                                h="44px"
                                fontSize="0.95rem"
                                fontWeight="600"
                                borderRadius="8px"
                                _hover={{
                                    bg: "rgba(10, 77, 104, 0.9)",
                                }}
                            >
                                Enregistrer
                            </Button>
                        </Flex>
                    </Flex>
                </Box>
            </Modal>
        </Box>
    );
};