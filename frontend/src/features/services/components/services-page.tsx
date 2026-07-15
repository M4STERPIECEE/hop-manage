import { Box, Table, Icon, Grid, Flex, Text, Button } from '@chakra-ui/react';
import { toaster } from '../../../shared/ui/toaster';
import { Pencil, CheckCircle, Clock, DollarSign, Smile } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../../../shared/ui/badge';
import { ServiceModal } from './modals/service-modal';
import { API_ENDPOINTS } from '../../../shared/api/api';
import { DataTable } from '../../../shared/ui/data-table';

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
            <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap="1.25rem" mb="2rem">
                <Box bg="white" p="1.5rem" borderRadius="12px" border="1px solid rgba(10, 77, 104, 0.1)" boxShadow="0 2px 8px rgba(10, 77, 104, 0.06)" transition="all 0.3s ease" _hover={{ transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(10, 77, 104, 0.12)' }}>
                    <Flex align="center" gap="0.75rem" mb="0.5rem">
                        <Box fontSize="2rem" color="accent">
                            <Icon as={Smile} />
                        </Box>
                        <Text fontSize="0.85rem" fontWeight="600" color="rgba(10, 77, 104, 0.7)" textTransform="uppercase" letterSpacing="0.5px">
                            Total Services
                        </Text>
                    </Flex>
                    <Text fontSize="2rem" fontWeight="700" color="primary" fontFamily="'Poppins', sans-serif">
                        {totalServices}
                    </Text>
                </Box>

                <Box bg="white" p="1.5rem" borderRadius="12px" border="1px solid rgba(34, 197, 94, 0.2)" boxShadow="0 2px 8px rgba(34, 197, 94, 0.08)" transition="all 0.3s ease" _hover={{ transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)' }}>
                    <Flex align="center" gap="0.75rem" mb="0.5rem">
                        <Box fontSize="2rem" color="#22c55e">
                            <Icon as={CheckCircle} />
                        </Box>
                        <Text fontSize="0.85rem" fontWeight="600" color="rgba(10, 77, 104, 0.7)" textTransform="uppercase" letterSpacing="0.5px">
                            Services Actifs
                        </Text>
                    </Flex>
                    <Text fontSize="2rem" fontWeight="700" color="#22c55e" fontFamily="'Poppins', sans-serif">
                        {activeServices}
                    </Text>
                </Box>

                <Box bg="white" p="1.5rem" borderRadius="12px" border="1px solid rgba(5, 199, 226, 0.2)" boxShadow="0 2px 8px rgba(5, 199, 226, 0.08)" transition="all 0.3s ease" _hover={{ transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(5, 199, 226, 0.15)' }}>
                    <Flex align="center" gap="0.75rem" mb="0.5rem">
                        <Box fontSize="2rem" color="accent">
                            <Icon as={Clock} />
                        </Box>
                        <Text fontSize="0.85rem" fontWeight="600" color="rgba(10, 77, 104, 0.7)" textTransform="uppercase" letterSpacing="0.5px">
                            Durée Moyenne
                        </Text>
                    </Flex>
                    <Text fontSize="2rem" fontWeight="700" color="accent" fontFamily="'Poppins', sans-serif">
                        {avgDuration} min
                    </Text>
                </Box>

                <Box bg="white" p="1.5rem" borderRadius="12px" border="1px solid rgba(251, 191, 36, 0.2)" boxShadow="0 2px 8px rgba(251, 191, 36, 0.08)" transition="all 0.3s ease" _hover={{ transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(251, 191, 36, 0.15)' }}>
                    <Flex align="center" gap="0.75rem" mb="0.5rem">
                        <Box fontSize="2rem" color="#fbbf24">
                            <Icon as={DollarSign} />
                        </Box>
                        <Text fontSize="0.85rem" fontWeight="600" color="rgba(10, 77, 104, 0.7)" textTransform="uppercase" letterSpacing="0.5px">
                            Prix Moyen
                        </Text>
                    </Flex>
                    <Text fontSize="2rem" fontWeight="700" color="#fbbf24" fontFamily="'Poppins', sans-serif">
                        {formatPrice(avgPrice)}
                    </Text>
                </Box>
            </Grid>
            <DataTable
                title="Services disponibles"
                subtitle={`${filteredServices.length} service${filteredServices.length > 1 ? 's' : ''} disponible${filteredServices.length > 1 ? 's' : ''}`}
                filters={
                    <Flex gap="0.75rem" flexWrap="wrap">
                        {categories.map((category) => (
                            <Button key={category} onClick={() => handleCategoryFilter(category)} bg={categoryFilter === category ? 'primary' : 'white'} color={categoryFilter === category ? 'white' : 'primary'} border="2px solid" borderColor={categoryFilter === category ? 'primary' : 'rgba(10, 77, 104, 0.2)'} px="1rem" py="0.5rem" borderRadius="20px" cursor="pointer" fontWeight="600" fontSize="0.85rem" transition="all 0.3s ease" _hover={{ bg: categoryFilter === category ? 'rgba(10, 77, 104, 0.9)' : 'rgba(10, 77, 104, 0.05)', transform: 'translateY(-2px)', boxShadow: '0 2px 8px rgba(10, 77, 104, 0.15)' }}>
                                {category}
                            </Button>
                        ))}
                    </Flex>
                }
                isLoading={isLoading}
                isEmpty={!isLoading && filteredServices.length === 0}
                emptyMessage="Aucun service trouvé"
                emptySubMessage=""
            >
                <Table.Root variant="line" size="md">
                    <Table.Header bg="rgba(10, 77, 104, 0.04)">
                        <Table.Row>
                            <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" letterSpacing="0.5px" py="1rem" px="1.25rem" minW="250px">Service</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" letterSpacing="0.5px" py="1rem" px="1.25rem">Durée</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" letterSpacing="0.5px" py="1rem" px="1.25rem">Prix</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" letterSpacing="0.5px" py="1rem" px="1.25rem">Statut</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" letterSpacing="0.5px" py="1rem" px="1.25rem">Actions</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {filteredServices.map((service, index) => (
                            <Table.Row key={service.id} _hover={{ bg: 'rgba(5, 199, 226, 0.04)', transition: 'all 0.2s ease' }} borderBottom={index === filteredServices.length - 1 ? 'none' : '1px solid rgba(10, 77, 104, 0.08)'}>
                                <Table.Cell py="1rem" px="1.25rem" fontWeight="600" color="primary" fontSize="0.95rem">
                                    <Flex align="center" gap="0.75rem">
                                        <Box bg="rgba(5, 199, 226, 0.1)" borderRadius="8px" p="0.5rem" fontSize="1.25rem" color="accent">
                                            <Icon as={Smile} />
                                        </Box>
                                        {service.name}
                                    </Flex>
                                </Table.Cell>
                                <Table.Cell py="1rem" px="1.25rem" color="rgba(10, 77, 104, 0.8)" fontSize="0.9rem">
                                    <Flex align="center" gap="0.5rem">
                                        <Box fontSize="0.9rem" color="accent">
                                            <Icon as={Clock} />
                                        </Box>
                                        <Text fontWeight="500">{service.durationMinutes} min</Text>
                                    </Flex>
                                </Table.Cell>
                                <Table.Cell py="1rem" px="1.25rem" color="primary" fontSize="0.95rem" fontWeight="700">
                                    {formatPrice(service.price)}
                                </Table.Cell>
                                <Table.Cell py="1rem" px="1.25rem">
                                    <Badge status={(service.status as 'Actif' | 'Inactif') || 'Actif'}>
                                        {service.status || 'Actif'}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell py="1rem" px="1.25rem">
                                    <Box as="button" bg="rgba(5, 199, 226, 0.1)" border="1px solid rgba(5, 199, 226, 0.2)" cursor="pointer" p="0.5rem" borderRadius="6px" transition="all 0.3s ease" color="accent" display="flex" alignItems="center" justifyContent="center" _hover={{ bg: 'rgba(5, 199, 226, 0.2)', transform: 'translateY(-2px)', boxShadow: '0 2px 8px rgba(5, 199, 226, 0.3)' }} title="Modifier" onClick={() => openEditModal(service)}>
                                        <Icon as={Pencil} boxSize="1.1rem" />
                                    </Box>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </DataTable>

            <ServiceModal
                isOpen={isModalOpen}
                onClose={closeModal}
                editForm={editForm}
                setEditForm={setEditForm}
                handleUpdateService={handleUpdateService}
                isUpdating={isUpdating}
            />
        </Box>
    );
};