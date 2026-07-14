import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    change?: string;
    variant?: 'primary' | 'accent' | 'success' | 'warning';
}

export const StatCard = ({ title, value, icon, change, variant = 'primary' }: StatCardProps) => {
    const getBorderColor = () => {
        switch (variant) {
            case 'accent':
                return 'var(--accent)';
            case 'success':
                return 'var(--success)';
            case 'warning':
                return 'var(--warning)';
            default:
                return 'var(--primary)';
        }
    };

    return (
        <Box
            bg="white"
            p="1.8rem"
            borderRadius="12px"
            boxShadow="0 1px 3px rgba(10, 77, 104, 0.08)"
            borderLeft={`4px solid ${getBorderColor()}`}
            transition="all 0.3s"
            _hover={{
                transform: 'translateY(-3px)',
                boxShadow: '0 4px 12px rgba(10, 77, 104, 0.12)',
            }}
        >
            <Flex justify="space-between" align="center" mb="1rem">
                <Text color="textGray" fontSize="0.9rem" fontWeight="500">
                    {title}
                </Text>
                <Flex
                    w="40px"
                    h="40px"
                    bg="accentSoft"
                    borderRadius="8px"
                    align="center"
                    justify="center"
                    fontSize="1.3rem"
                >
                    {icon}
                </Flex>
            </Flex>
            <Heading
                as="div"
                fontFamily="'Crimson Pro', serif"
                fontSize="2.2rem"
                fontWeight="700"
                color="primary"
            >
                {value}
            </Heading>
            {change && (
                <Text color="success" fontSize="0.85rem" mt="0.5rem">
                    {change}
                </Text>
            )}
        </Box>
    );
};
