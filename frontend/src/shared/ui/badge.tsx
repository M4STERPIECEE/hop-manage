import { Box } from '@chakra-ui/react';

interface BadgeProps {
    status: 'Confirmé' | 'En attente' | 'Annulé' | 'Actif' | 'Inactif' | 'Terminé' | 'PENDING' | 'CONFIRMED' | 'COMPLETED';
    children: React.ReactNode;
}

export const Badge = ({ status, children }: BadgeProps) => {
    const getColorScheme = () => {
        switch (status) {
            case 'Confirmé':
            case 'CONFIRMED':
            case 'Actif':
                return {
                    bg: 'rgba(16, 185, 129, 0.1)',
                    color: 'var(--success)',
                };
            case 'Terminé':
            case 'COMPLETED':
                return {
                    bg: 'rgba(5, 199, 226, 0.1)',
                    color: 'var(--accent)',
                };
            case 'En attente':
            case 'PENDING':
                return {
                    bg: 'rgba(245, 158, 11, 0.1)',
                    color: 'var(--warning)',
                };
            case 'Annulé':
            case 'Inactif':
                return {
                    bg: 'rgba(239, 68, 68, 0.1)',
                    color: 'var(--danger)',
                };
            default:
                return {
                    bg: 'rgba(10, 77, 104, 0.1)',
                    color: 'var(--primary)',
                };
        }
    };

    const colors = getColorScheme();

    return (
        <Box
            as="span"
            display="inline-block"
            px="0.8rem"
            py="0.4rem"
            borderRadius="20px"
            fontSize="0.85rem"
            fontWeight="600"
            bg={colors.bg}
            color={colors.color}
        >
            {children}
        </Box>
    );
};
