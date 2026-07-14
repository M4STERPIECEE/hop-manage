import { Box, Grid, Heading, Text, Icon } from '@chakra-ui/react';
import { FiCalendar, FiUsers, FiCheckCircle, FiClock } from 'react-icons/fi';
import { StatCard } from '../components/dashboard/StatCard';
import { ActivityChart } from '../components/dashboard/ActivityChart';

export const OverviewPage = () => {

    const today = new Date();
    const greeting = 
        today.getHours() < 12 
            ? 'Bonjour' 
            : today.getHours() < 18 
            ? 'Bon après-midi' 
            : 'Bonsoir';

    return (
        <Box>
            <Box 
                mb="2rem" 
                p="1.5rem" 
                bg="linear-gradient(135deg, rgba(10, 77, 104, 0.05) 0%, rgba(5, 199, 226, 0.05) 100%)"
                borderRadius="12px"
                border="1px solid rgba(10, 77, 104, 0.1)"
            >
                <Heading
                    as="h1"
                    fontFamily="'Crimson Pro', serif"
                    fontSize="2rem"
                    color="primary"
                    mb="0.5rem"
                    fontWeight="700"
                >
                    {greeting}, Dr. Martin 👋
                </Heading>
                <Text 
                    fontSize="0.95rem" 
                    color="rgba(10, 77, 104, 0.7)"
                    fontWeight="500"
                >
                    Voici un aperçu de votre activité aujourd'hui
                </Text>
            </Box>
            <Grid
                templateColumns="repeat(auto-fit, minmax(240px, 1fr))"
                gap="1.25rem"
                mb="2rem"
            >
                <StatCard
                    title="Rendez-vous aujourd'hui"
                    value="12"
                    icon={<Icon as={FiCalendar} />}
                    change="+3 depuis hier"
                    variant="primary"
                />
                <StatCard
                    title="Patients actifs"
                    value="342"
                    icon={<Icon as={FiUsers} />}
                    change="+15 ce mois"
                    variant="accent"
                />
                <StatCard
                    title="Taux de présence"
                    value="94%"
                    icon={<Icon as={FiCheckCircle} />}
                    change="+2% ce mois"
                    variant="success"
                />
                <StatCard
                    title="En attente"
                    value="8"
                    icon={<Icon as={FiClock} />}
                    change="Confirmations requises"
                    variant="warning"
                />
            </Grid>
            <ActivityChart />
        </Box>
    );
};