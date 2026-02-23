import { Box, Table, Grid, Flex, Heading, Text, Input, Button, Icon, Spinner } from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { Modal } from '../components/common/Modal';
import type { Patient } from '../types';
import { FiChevronLeft, FiChevronRight, FiUsers, FiUserCheck, FiUserPlus, FiSearch } from 'react-icons/fi';

export const PatientsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const fetchPatients = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiBase}/users/patients?page=${currentPage}&size=5`);
            if (!response.ok) throw new Error('Failed to fetch patients');
            const data = await response.json();
            
            const content = data.content || [];
            const mapped: Patient[] = content.map((user: {
                id: string | number;
                firstName: string;
                lastName: string;
                email: string;
                phone?: string;
                updatedAt?: string;
                createdAt?: string;
            }) => ({
                id: Number(user.id) || 0,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email || '',
                phone: user.phone || 'Non renseigné',
                lastVisit: user.updatedAt || user.createdAt || new Date().toISOString()
            }));

            setPatients(mapped);
            setFilteredPatients(mapped);
            setTotalPages(data.totalPages || 1);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setIsLoading(false);
        }
    }, [apiBase, currentPage]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const handleSearch = (value: string) => {
        setSearchValue(value);
        const filtered = patients.filter(
            (patient) =>
                patient.name.toLowerCase().includes(value.toLowerCase()) ||
                patient.email.toLowerCase().includes(value.toLowerCase()) ||
                patient.phone.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredPatients(filtered);
    };
    const totalPatientsCount = totalElements;
    const activePatientsCount = patients.length; 
    const newThisMonthCount = patients.filter(p => {
        const d = new Date(p.lastVisit);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return (
        <Box>
            <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap="1.25rem" mb="2rem">
                <Box bg="white" p="1.5rem" borderRadius="12px" border="1px solid rgba(10, 77, 104, 0.1)" boxShadow="0 2px 8px rgba(10, 77, 104, 0.06)" transition="all 0.3s ease" _hover={{ transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(10, 77, 104, 0.12)' }}>
                    <Flex align="center" gap="0.75rem" mb="0.5rem">
                        <Icon as={FiUsers} boxSize="1.5rem" color="primary" />
                        <Text fontSize="0.85rem" fontWeight="600" color="rgba(10, 77, 104, 0.7)" textTransform="uppercase" letterSpacing="0.5px">Total Patients</Text>
                    </Flex>
                    <Text fontSize="2rem" fontWeight="700" color="primary" fontFamily="'Crimson Pro', serif">{totalPatientsCount}</Text>
                </Box>

                <Box bg="white" p="1.5rem" borderRadius="12px" border="1px solid rgba(5, 199, 226, 0.2)" boxShadow="0 2px 8px rgba(5, 199, 226, 0.08)" transition="all 0.3s ease" _hover={{ transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(5, 199, 226, 0.15)' }}>
                    <Flex align="center" gap="0.75rem" mb="0.5rem">
                        <Icon as={FiUserCheck} boxSize="1.5rem" color="accent" />
                        <Text fontSize="0.85rem" fontWeight="600" color="rgba(10, 77, 104, 0.7)" textTransform="uppercase" letterSpacing="0.5px">Patients récents</Text>
                    </Flex>
                    <Text fontSize="2rem" fontWeight="700" color="accent" fontFamily="'Crimson Pro', serif">{activePatientsCount}</Text>
                </Box>

                <Box bg="white" p="1.5rem" borderRadius="12px" border="1px solid rgba(34, 197, 94, 0.2)" boxShadow="0 2px 8px rgba(34, 197, 94, 0.08)" transition="all 0.3s ease" _hover={{ transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)' }}>
                    <Flex align="center" gap="0.75rem" mb="0.5rem">
                        <Icon as={FiUserPlus} boxSize="1.5rem" color="#22c55e" />
                        <Text fontSize="0.85rem" fontWeight="600" color="rgba(10, 77, 104, 0.7)" textTransform="uppercase" letterSpacing="0.5px">Nouveaux ce mois</Text>
                    </Flex>
                    <Text fontSize="2rem" fontWeight="700" color="#22c55e" fontFamily="'Crimson Pro', serif">{newThisMonthCount}</Text>
                </Box>
            </Grid>

            {/* Patients Table */}
            <Box bg="white" borderRadius="12px" p="1.5rem" boxShadow="0 2px 12px rgba(10, 77, 104, 0.08)" border="1px solid rgba(10, 77, 104, 0.08)">
                <Flex justify="space-between" align="center" mb="1.5rem" gap="1rem">
                    <Box>
                        <Heading as="h2" fontFamily="'Crimson Pro', serif" fontSize="1.5rem" color="primary" mb="0.25rem" fontWeight="700">Liste des patients</Heading>
                        <Text fontSize="0.85rem" color="rgba(10, 77, 104, 0.6)" fontWeight="500">{totalElements} patient{totalElements > 1 ? 's' : ''} au total</Text>
                    </Box>

                    <Flex gap="0.75rem" align="center" flexWrap="nowrap" w="100%" maxW="520px">
                        <Input
                            placeholder="🔍 Rechercher un patient..."
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                            border="2px solid rgba(10, 77, 104, 0.15)"
                            borderRadius="8px"
                            px="1rem"
                            py="0.6rem"
                            fontSize="0.9rem"
                            flex="1"
                            transition="all 0.3s ease"
                            _focus={{ borderColor: 'accent', boxShadow: '0 0 0 3px rgba(5, 199, 226, 0.1)', outline: 'none' }}
                            _hover={{ borderColor: 'rgba(10, 77, 104, 0.25)' }}
                        />
                    </Flex>
                </Flex>

                <Box overflowX="auto" borderRadius="8px" border="1px solid rgba(10, 77, 104, 0.1)" minH="200px" position="relative">
                    {isLoading ? (
                        <Flex justify="center" align="center" py="5rem">
                            <Spinner size="xl" color="primary" />
                        </Flex>
                    ) : (
                        <Table.Root variant="line" size="md">
                            <Table.Header bg="rgba(10, 77, 104, 0.04)">
                                <Table.Row>
                                    <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" letterSpacing="0.5px" py="1rem" px="1.25rem">ID</Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" letterSpacing="0.5px" py="1rem" px="1.25rem">Nom complet</Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" letterSpacing="0.5px" py="1rem" px="1.25rem">Email</Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" letterSpacing="0.5px" py="1rem" px="1.25rem">Téléphone</Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="700" fontSize="0.85rem" color="primary" textTransform="uppercase" letterSpacing="0.5px" py="1rem" px="1.25rem">Dernière visite</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {filteredPatients.map((patient, index) => (
                                    <Table.Row key={patient.id} _hover={{ bg: 'rgba(5, 199, 226, 0.04)', transition: 'all 0.2s ease' }} borderBottom={index === filteredPatients.length - 1 ? 'none' : '1px solid rgba(10, 77, 104, 0.08)'}>
                                        <Table.Cell py="1rem" px="1.25rem" fontWeight="700" color="rgba(10, 77, 104, 0.5)" fontSize="0.85rem">
                                            #{String(patient.id).substring(0, 8)}
                                        </Table.Cell>
                                        <Table.Cell py="1rem" px="1.25rem" fontWeight="600" color="primary" fontSize="0.95rem">{patient.name}</Table.Cell>
                                        <Table.Cell py="1rem" px="1.25rem" color="rgba(10, 77, 104, 0.7)" fontSize="0.9rem">{patient.email}</Table.Cell>
                                        <Table.Cell py="1rem" px="1.25rem" color="rgba(10, 77, 104, 0.7)" fontSize="0.9rem" fontWeight="500">{patient.phone}</Table.Cell>
                                        <Table.Cell py="1rem" px="1.25rem" color="rgba(10, 77, 104, 0.7)" fontSize="0.9rem">{formatDate(patient.lastVisit)}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    )}
                </Box>

                <Flex justify="center" align="center" gap="1rem" mt="1.5rem">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}>
                        <Icon as={FiChevronLeft} />
                    </Button>
                    <Text fontWeight="600" fontSize="0.9rem" color="primary">Page {currentPage + 1} sur {totalPages}</Text>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))} disabled={currentPage >= totalPages - 1} _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}>
                        <Icon as={FiChevronRight} />
                    </Button>
                </Flex>

                {!isLoading && filteredPatients.length === 0 && (
                    <Box textAlign="center" py="3rem">
                        <Icon as={FiSearch} boxSize="3rem" color="rgba(10, 77, 104, 0.2)" mb="1rem" />
                        <Text fontSize="1.1rem" fontWeight="600" color="primary" mb="0.5rem">Aucun patient trouvé</Text>
                        <Text fontSize="0.9rem" color="rgba(10, 77, 104, 0.6)">Essayez de modifier vos critères de recherche</Text>
                    </Box>
                )}
            </Box>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau patient">
                <Box>Formulaire de création de patient à implémenter</Box>
            </Modal>
        </Box>
    );
};