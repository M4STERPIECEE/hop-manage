import { Box, Flex, Text, Icon } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import type { IconType } from 'react-icons';
import {
    FiBarChart2,
    FiCalendar,
    FiUsers,
    FiGrid,
    FiClipboard,
    FiSettings,
} from 'react-icons/fi';

interface NavItem {
    path: string;
    icon: IconType;
    label: string;
}

const navItems: NavItem[] = [
    { path: '/dashboard', icon: FiBarChart2, label: "Vue d'ensemble" },
    { path: '/dashboard/appointments', icon: FiClipboard, label: 'Rendez-vous' },
    { path: '/dashboard/patients', icon: FiUsers, label: 'Patients' },
    { path: '/dashboard/calendar', icon: FiCalendar, label: 'Calendrier' },
    { path: '/dashboard/services', icon: FiGrid, label: 'Services' },
    { path: '/dashboard/settings', icon: FiSettings, label: 'Paramètres' },
];

interface SidebarProps {
    isOpen?: boolean;
}

export const Sidebar = ({ isOpen = true }: SidebarProps) => {
    const location = useLocation();

    return (
        <Box
            as="aside"
            w="280px"
            bg="primary"
            color="white"
            py="2rem"
            position="fixed"
            h="100vh"
            overflowY="auto"
            transition="transform 0.3s"
            transform={{ base: isOpen ? 'translateX(0)' : 'translateX(-100%)', lg: 'translateX(0)' }}
            zIndex="1000"
        >
            <Box px="1.5rem" mb="2rem">
                <Flex
                    align="center"
                    gap="0.5rem"
                    fontFamily="'Crimson Pro', serif"
                    fontSize="1.6rem"
                    fontWeight="700"
                >
                    <Flex
                        w="40px"
                        h="40px"
                        bg="linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))"
                        borderRadius="8px"
                        align="center"
                        justify="center"
                        fontSize="1.5rem"
                    >
                        🦷
                    </Flex>
                    DentiCare
                </Flex>
            </Box>

            <Box as="nav">
                <Box as="ul" listStyleType="none">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Box as="li" key={item.path} mb="0.5rem">
                                <Link
                                    to={item.path}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem 1.5rem',
                                        color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s',
                                        background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                        borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.borderLeftColor = 'var(--accent)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent';
                                        e.currentTarget.style.color = isActive ? 'white' : 'rgba(255, 255, 255, 0.8)';
                                        e.currentTarget.style.borderLeftColor = isActive ? 'var(--accent)' : 'transparent';
                                    }}
                                >
                                    <Icon as={item.icon} boxSize="1.25rem" />
                                    <Text>{item.label}</Text>
                                </Link>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
};
