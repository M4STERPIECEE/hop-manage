import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ConfirmModal } from '../common';
import { authService } from '../../services/authService';

interface TopBarProps {
    title: string;
    onMenuToggle?: () => void;
}

export const TopBar = ({ title, onMenuToggle }: TopBarProps) => {
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = async () => {
        try {
            await authService.logout();
            setIsLogoutModalOpen(false);
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            setIsLogoutModalOpen(false);
            navigate('/', { replace: true });
        }
    };

    const handleCancelLogout = () => {
        setIsLogoutModalOpen(false);
    };

    return (
        <>
            <Box
                bg="white"
                px="2rem"
                py="1.5rem"
                boxShadow="0 1px 3px rgba(10, 77, 104, 0.08)"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                position="sticky"
                top="0"
                zIndex="100"
            >
                <Flex align="center" gap="1rem">
                    <Button
                        onClick={onMenuToggle}
                        display={{ base: 'block', lg: 'none' }}
                        bg="primary"
                        color="white"
                        border="none"
                        p="0.8rem"
                        borderRadius="8px"
                        cursor="pointer"
                        fontSize="1.5rem"
                        minW="auto"
                        h="auto"
                    >
                        ☰
                    </Button>
                    <Heading
                        as="h1"
                        fontFamily="'Crimson Pro', serif"
                        fontSize="1.8rem"
                        color="primary"
                    >
                        {title}
                    </Heading>
                </Flex>

                <Flex align="center" gap="1rem">
                    <Flex
                        w="45px"
                        h="45px"
                        bg="linear-gradient(135deg, var(--primary), var(--accent))"
                        borderRadius="50%"
                        align="center"
                        justify="center"
                        color="white"
                        fontWeight="600"
                    >
                        Dr
                    </Flex>
                    <Box display={{ base: 'none', md: 'block' }}>Dr. Martin</Box>
                    <Button
                        onClick={handleLogoutClick}
                        bg="danger"
                        color="white"
                        px="1.2rem"
                        py="0.6rem"
                        border="none"
                        borderRadius="6px"
                        cursor="pointer"
                        fontWeight="500"
                        transition="all 0.3s"
                        _hover={{
                            bg: '#dc2626',
                            transform: 'translateY(-2px)',
                        }}
                    >
                        Déconnexion
                    </Button>
                </Flex>
            </Box>

            <ConfirmModal
                isOpen={isLogoutModalOpen}
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
                title="Confirmation de déconnexion"
                message="Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte."
                confirmText="Se déconnecter"
                cancelText="Annuler"
            />
        </>
    );
};
