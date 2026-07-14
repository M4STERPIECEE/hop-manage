import { Box, Flex, Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

interface HeaderProps {
    onAdminClick?: () => void;
}

export const Header = ({ onAdminClick }: HeaderProps) => {
    return (
        <Box
            as="header"
            bg="bgWhite"
            boxShadow="0 1px 3px rgba(10, 77, 104, 0.08)"
            position="sticky"
            top="0"
            zIndex="100"
            css={{
                animation: 'slideDown 0.6s ease-out',
            }}
        >
            <Flex
                maxW="1400px"
                mx="auto"
                px="2rem"
                py="1.2rem"
                justify="space-between"
                align="center"
            >
                <Flex align="center" gap="0.5rem" fontFamily="'Crimson Pro', serif" fontSize="1.8rem" fontWeight="700" color="primary">
                    <Flex
                        w="40px"
                        h="40px"
                        bg="linear-gradient(135deg, var(--primary), var(--accent))"
                        borderRadius="8px"
                        align="center"
                        justify="center"
                        color="white"
                        fontSize="1.5rem"
                    >
                        🦷
                    </Flex>
                    DentiCare
                </Flex>

                <Flex as="ul" gap="2rem" listStyleType="none" display={{ base: 'none', md: 'flex' }}>
                    <li>
                        <ChakraLink
                            href="#services"
                            color="textGray"
                            textDecoration="none"
                            fontWeight="500"
                            transition="color 0.3s"
                            _hover={{ color: 'primary' }}
                        >
                            Services
                        </ChakraLink>
                    </li>
                    <li>
                        <ChakraLink
                            href="#about"
                            color="textGray"
                            textDecoration="none"
                            fontWeight="500"
                            transition="color 0.3s"
                            _hover={{ color: 'primary' }}
                        >
                            À propos
                        </ChakraLink>
                    </li>
                    <li>
                        <ChakraLink
                            href="#contact"
                            color="textGray"
                            textDecoration="none"
                            fontWeight="500"
                            transition="color 0.3s"
                            _hover={{ color: 'primary' }}
                        >
                            Contact
                        </ChakraLink>
                    </li>
                </Flex>

                <RouterLink
                    to="/login"
                    onClick={onAdminClick}
                    style={{
                        background: 'var(--primary)',
                        color: 'white',
                        padding: '0.7rem 1.5rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        transition: 'all 0.3s',
                        boxShadow: '0 1px 3px rgba(10, 77, 104, 0.08)',
                        display: 'inline-block',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--primary-dark)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(10, 77, 104, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--primary)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(10, 77, 104, 0.08)';
                    }}
                >
                    Espace Admin
                </RouterLink>
            </Flex>
        </Box>
    );
};
