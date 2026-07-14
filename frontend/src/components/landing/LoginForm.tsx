import { Box, Button, Heading, Input, Text, Flex, Link } from '@chakra-ui/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { authService } from '../../services/authService';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfo(null);
        setIsSubmitting(true);

        try {
            await authService.login({ email, password });
            navigate('/dashboard', { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Identifiants invalides.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = async () => {
        setError(null);
        setInfo(null);

        if (!email) {
            setError('Veuillez saisir votre email.');
            return;
        }

        try {
            await authService.requestPasswordReset(email);
            setInfo('Demande envoyée. Vérifiez votre email.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur de réinitialisation.');
        }
    };

    return (
        <Box
            bg="white"
            borderRadius="16px"
            p="2.5rem"
            boxShadow="0 10px 30px rgba(10, 77, 104, 0.15)"
            color="textDark"
        >
            <Heading
                as="h2"
                fontFamily="'Crimson Pro', serif"
                color="primary"
                fontSize="2rem"
                mb="0.5rem"
            >
                Login administrateur
            </Heading>
            <Text fontSize="0.95rem" color="rgba(10, 77, 104, 0.7)" mb="1.5rem">
                Accedez au tableau de bord securise.
            </Text>

            <form onSubmit={handleSubmit}>
                <Box mb="1.5rem">
                    <Box
                        as="label"
                        display="block"
                        color="textDark"
                        fontWeight="600"
                        mb="0.5rem"
                        fontSize="0.95rem"
                    >
                        Email
                    </Box>
                    <Box position="relative">
                        <Box
                            position="absolute"
                            left="0.9rem"
                            top="50%"
                            transform="translateY(-50%)"
                            color="rgba(10, 77, 104, 0.5)"
                            zIndex="1"
                            pointerEvents="none"
                        >
                            <FiMail size={18} />
                        </Box>
                        <Input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            w="100%"
                            p="0.9rem"
                            pl="2.8rem"
                            border="2px solid var(--border)"
                            borderRadius="8px"
                            fontSize="1rem"
                            transition="all 0.3s"
                            _focus={{
                                outline: 'none',
                                borderColor: 'accent',
                                boxShadow: '0 0 0 3px rgba(5, 199, 226, 0.1)',
                            }}
                        />
                    </Box>
                </Box>

                <Box mb="1rem">
                    <Box
                        as="label"
                        display="block"
                        color="textDark"
                        fontWeight="600"
                        mb="0.5rem"
                        fontSize="0.95rem"
                    >
                        Mot de passe
                    </Box>
                    <Box position="relative">
                        <Box
                            position="absolute"
                            left="0.9rem"
                            top="50%"
                            transform="translateY(-50%)"
                            color="rgba(10, 77, 104, 0.5)"
                            zIndex="1"
                            pointerEvents="none"
                        >
                            <FiLock size={18} />
                        </Box>
                        <Input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            w="100%"
                            p="0.9rem"
                            pl="2.8rem"
                            border="2px solid var(--border)"
                            borderRadius="8px"
                            fontSize="1rem"
                            transition="all 0.3s"
                            _focus={{
                                outline: 'none',
                                borderColor: 'accent',
                                boxShadow: '0 0 0 3px rgba(5, 199, 226, 0.1)',
                            }}
                        />
                    </Box>
                </Box>

                <Flex justify="flex-end" mb="1.5rem">
                    <Link
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleForgotPassword();
                        }}
                        fontSize="0.9rem"
                        color="accent"
                        fontWeight="500"
                        _hover={{
                            color: 'primary',
                        }}
                    >
                        Mot de passe oublié ?
                    </Link>
                </Flex>

                {error && (
                    <Box
                        mb="1rem"
                        p="0.75rem"
                        borderRadius="8px"
                        bg="rgba(220, 38, 38, 0.08)"
                        border="1px solid rgba(220, 38, 38, 0.2)"
                        color="#dc2626"
                        fontSize="0.9rem"
                        fontWeight="600"
                        textAlign="center"
                    >
                        {error}
                    </Box>
                )}

                {info && (
                    <Box
                        mb="1rem"
                        p="0.75rem"
                        borderRadius="8px"
                        bg="rgba(5, 199, 226, 0.08)"
                        border="1px solid rgba(5, 199, 226, 0.2)"
                        color="accent"
                        fontSize="0.9rem"
                        fontWeight="600"
                        textAlign="center"
                    >
                        {info}
                    </Box>
                )}


                <Flex justify="center">
                    <Button
                        type="submit"
                        bg="var(--primary)"
                        color="white"
                        p="1rem 2rem"
                        border="2px solid var(--primary)"
                        borderRadius="8px"
                        fontSize="1.1rem"
                        fontWeight="600"
                        cursor="pointer"
                        w="50%"
                        transition="all 0.3s"
                        _hover={{
                            bg: 'primary',
                            color: 'white',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(10, 77, 104, 0.3)',
                        }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Connexion...' : 'Se connecter'}
                    </Button>
                </Flex>
            </form>
        </Box>
    );
};
