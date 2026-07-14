import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { TopBar } from '../components/dashboard/TopBar';

interface DashboardLayoutProps {
    title: string;
}

export const DashboardLayout = ({ title }: DashboardLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Flex minH="100vh">
            <Sidebar isOpen={isSidebarOpen} />
            <Box
                flex="1"
                ml={{ base: '0', lg: '280px' }}
                bg="bgLight"
            >
                <TopBar title={title} onMenuToggle={toggleSidebar} />
                <Box p="2rem">
                    <Outlet />
                </Box>
            </Box>
        </Flex>
    );
};
