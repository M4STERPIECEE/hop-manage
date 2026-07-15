import { Box, Grid, Heading, Text, Spinner, Icon } from '@chakra-ui/react';
import { useState, useEffect, type ElementType } from 'react';
import { API_ENDPOINTS } from '../../../shared/api/api';
import { Search, Sparkles, Gem, Smile, Crosshair, AlertTriangle } from 'lucide-react';

interface ServiceWithIcon {
    id: string;
    name: string;
    description: string;
    icon: ElementType;
}

const serviceIcons: Record<string, ElementType> = {
    'Consultation generale': Search,
    'Detartrage': Sparkles,
    'Blanchiment': Gem,
    'Implant dentaire': Smile,
    'Orthodontie': Crosshair,
    'Urgence': AlertTriangle,
};

export const ServicesSection = () => {
    const [services, setServices] = useState<ServiceWithIcon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.services);
                if (response.ok) {
                    const data = await response.json();
                    const servicesWithIcons = data.map((service: { id: string; name: string; description: string }) => ({
                        ...service,
                        icon: serviceIcons[service.name] || Smile,
                    }));
                    setServices(servicesWithIcons);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    if (loading) {
        return (
            <Box as="section" py="5rem" px="2rem" maxW="1400px" mx="auto" id="services" display="flex" justifyContent="center">
                <Spinner size="xl" color="primary" />
            </Box>
        );
    }

    return (
        <Box as="section" py="5rem" px="2rem" maxW="1400px" mx="auto" id="services">
            <Heading as="h2" fontFamily="'Poppins', sans-serif" fontSize="2.8rem" textAlign="center" color="primary" mb="3rem">
                Nos Services
            </Heading>

            <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap="2rem">
                {services.map((service) => (
                    <Box key={service.id} bg="white" p="2rem" borderRadius="12px" boxShadow="0 1px 3px rgba(10, 77, 104, 0.08)" transition="all 0.3s" border="2px solid transparent" _hover={{ transform: 'translateY(-5px)', boxShadow: '0 4px 12px rgba(10, 77, 104, 0.12)', borderColor: 'accentSoft' }}>
                        <Box w="60px" h="60px" bg="accentSoft" borderRadius="12px" display="flex" alignItems="center" justifyContent="center" fontSize="2rem" mb="1.5rem">
                            <Icon as={service.icon} boxSize="1.8rem" color="primary" />
                        </Box>
                        <Heading as="h3" fontFamily="'Poppins', sans-serif" fontSize="1.5rem" color="primary" mb="0.8rem">
                            {service.name}
                        </Heading>
                        <Text color="textGray" lineHeight="1.7">
                            {service.description}
                        </Text>
                    </Box>
                ))}
            </Grid>
        </Box>
    );
};