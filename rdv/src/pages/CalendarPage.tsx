import { Box, Button, Flex, Grid, Heading, Text, Badge, Spinner, Icon } from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import type { Appointment } from '../types';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export const CalendarPage = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';

    const monthNames = [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
    ];

    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    useEffect(() => {
        fetchCalendarData();
    }, [fetchCalendarData]);

    const fetchCalendarData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiBase}/appointments/calendar?year=${currentYear}&month=${currentMonth + 1}`);
            if (!response.ok) throw new Error('Failed to fetch calendar data');
            const data = await response.json();
            
            const mapped: Appointment[] = data.map((app: {
                id: string;
                user?: { firstName: string; lastName: string; email: string; phone: string };
                service?: { name: string };
                appointmentDate?: string;
                status?: Appointment['status'];
            }) => ({
                id: app.id || '',
                patient: app.user ? `${app.user.firstName} ${app.user.lastName}` : 'Inconnu',
                email: app.user ? app.user.email : '',
                phone: app.user ? app.user.phone : '',
                service: app.service ? app.service.name : 'Service inconnu',
                date: app.appointmentDate ? app.appointmentDate.split('T')[0] : '',
                time: app.appointmentDate ? new Date(app.appointmentDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
                status: app.status || 'En attente'
            }));
            
            setAppointments(mapped);
        } catch (error) {
            console.error('Error fetching calendar data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [apiBase, currentMonth, currentYear]);

    const changeMonth = (delta: number) => {
        let newMonth = currentMonth + delta;
        let newYear = currentYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const isToday = (day: number) => {
        const d = new Date();
        return (
            day === d.getDate() &&
            currentMonth === d.getMonth() &&
            currentYear === d.getFullYear()
        );
    };

    const generateCalendar = () => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const days = [];

        dayNames.forEach((day) => {
            days.push(
                <Box
                    key={`header-${day}`}
                    textAlign="center"
                    fontWeight="700"
                    fontSize="0.65rem"
                    p="0.35rem"
                    color="primary"
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                >
                    {day}
                </Box>
            );
        });

        for (let i = 0; i < firstDay; i++) {
            days.push(<Box key={`empty-${i}`} />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayAppointments = appointments.filter((app) => {
                const appDate = new Date(app.date);
                return (
                    appDate.getDate() === day &&
                    appDate.getMonth() === currentMonth &&
                    appDate.getFullYear() === currentYear
                );
            });

            const hasAppointment = dayAppointments.length > 0;
            const todayCheck = isToday(day);

            days.push(
                <Box
                    key={`day-${day}`}
                    position="relative"
                    aspectRatio="1.25"
                    border="2px solid"
                    borderColor={todayCheck ? 'accent' : hasAppointment ? 'rgba(5, 199, 226, 0.3)' : 'rgba(10, 77, 104, 0.1)'}
                    borderRadius="8px"
                    p="0.35rem"
                    textAlign="center"
                    cursor="pointer"
                    transition="all 0.3s ease"
                    bg={
                        todayCheck
                            ? 'linear-gradient(135deg, rgba(5, 199, 226, 0.15) 0%, rgba(5, 199, 226, 0.05) 100%)'
                            : hasAppointment
                            ? 'linear-gradient(135deg, rgba(5, 199, 226, 0.08) 0%, rgba(5, 199, 226, 0.02) 100%)'
                            : 'transparent'
                    }
                    _hover={{
                        borderColor: 'accent',
                        bg: 'linear-gradient(135deg, rgba(5, 199, 226, 0.15) 0%, rgba(5, 199, 226, 0.08) 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(5, 199, 226, 0.2)',
                    }}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {todayCheck && (
                        <Badge
                            position="absolute"
                            top="-8px"
                            right="-8px"
                            bg="accent"
                            color="white"
                            borderRadius="full"
                            fontSize="0.65rem"
                            px="0.5rem"
                            py="0.15rem"
                            fontWeight="700"
                            display={{ base: 'none', sm: 'block' }}
                        >
                            Aujourd'hui
                        </Badge>
                    )}
                    <Box 
                        fontWeight={todayCheck ? "800" : "600"} 
                        fontSize="0.8rem"
                        color={todayCheck ? 'accent' : 'primary'}
                    >
                        {day}
                    </Box>
                    {hasAppointment && (
                        <Flex
                            align="center"
                            gap="0.25rem"
                            mt="0.5rem"
                        >
                            <Box
                                w="6px"
                                h="6px"
                                borderRadius="full"
                                bg="accent"
                            />
                            <Text 
                                fontSize="0.55rem" 
                                color="accent"
                                fontWeight="600"
                            >
                                {dayAppointments.length} RDV
                            </Text>
                        </Flex>
                    )}
                </Box>
            );
        }

        return days;
    };

    return (
        <Box 
            bg="white" 
            borderRadius="12px" 
            p="1rem" 
            boxShadow="0 4px 20px rgba(10, 77, 104, 0.08)"
            border="1px solid rgba(10, 77, 104, 0.08)"
            w="100%"
            position="relative"
        >
            <Flex 
                justify="space-between" 
                align="center" 
                mb="1rem"
                pb="0.75rem"
                borderBottom="2px solid rgba(10, 77, 104, 0.08)"
            >
                <Box>
                    <Heading
                        as="h2"
                        fontFamily="'Crimson Pro', serif"
                        fontSize="1.4rem"
                        color="primary"
                        mb="0.25rem"
                        fontWeight="700"
                    >
                        {monthNames[currentMonth]} {currentYear}
                    </Heading>
                    <Text 
                        fontSize="0.75rem" 
                        color="rgba(10, 77, 104, 0.6)"
                        fontWeight="500"
                    >
                        Gérez vos rendez-vous
                    </Text>
                </Box>
                <Flex gap="0.4rem">
                    <Button
                        onClick={() => changeMonth(-1)}
                        variant="outline"
                        size="sm"
                        borderColor="primary"
                        color="primary"
                        _hover={{ bg: 'primary', color: 'white' }}
                    >
                        <Flex align="center" gap="0.4rem">
                            <Icon as={FiChevronLeft} />
                            <Text as="span">Précédent</Text>
                        </Flex>
                    </Button>
                    <Button
                        onClick={() => changeMonth(1)}
                        variant="solid"
                        size="sm"
                        bg="primary"
                        color="white"
                        _hover={{ bg: 'primaryDark' }}
                    >
                        <Flex align="center" gap="0.4rem">
                            <Text as="span">Suivant</Text>
                            <Icon as={FiChevronRight} />
                        </Flex>
                    </Button>
                </Flex>
            </Flex>

            {isLoading ? (
                <Flex justify="center" align="center" py="5rem">
                    <Spinner size="xl" color="accent" />
                </Flex>
            ) : (
                <Grid 
                    templateColumns="repeat(7, 1fr)" 
                    gap="0.35rem"
                    position="relative"
                >
                    {generateCalendar()}
                </Grid>
            )}
        </Box>
    );
};