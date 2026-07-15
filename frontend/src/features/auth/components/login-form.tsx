import { Box, Button, Heading, Input, Text, Flex, Link } from '@chakra-ui/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { authService } from '../api/auth-service';

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
        <Box bg="rgba(255, 255, 255, 0.1)" backdropFilter="blur(16px)" borderRadius="24px" p="3rem" boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)" border="1px solid rgba(255, 255, 255, 0.2)" color="white" transition="all 0.3s ease" _hover={{ boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)" }}>
            <Heading as="h2" fontFamily="'Poppins', sans-serif" color="white" fontSize="2.2rem" mb="0.5rem" fontWeight="700">
                Login administrateur
            </Heading>
            <Text fontSize="1rem" color="rgba(255, 255, 255, 0.8)" mb="2rem">
                Accédez au tableau de bord sécurisé.
            </Text>

            <form onSubmit={handleSubmit}>
                <Box mb="1.5rem">
                    <Box as="label" display="block" color="white" fontWeight="500" mb="0.5rem" fontSize="0.95rem" letterSpacing="0.5px">
                        Email
                    </Box>
                    <Box position="relative">
                        <Box position="absolute" left="1rem" top="50%" transform="translateY(-50%)" color="rgba(255, 255, 255, 0.6)" zIndex="1" pointerEvents="none">
                            <Mail size={18} />
                        </Box>
                        <Input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="votre@email.com" _placeholder={{ color: 'rgba(255, 255, 255, 0.4)' }} w="100%" h="3.5rem" pl="3rem" bg="rgba(255, 255, 255, 0.05)" border="1px solid rgba(255, 255, 255, 0.1)" borderRadius="12px" fontSize="1rem" color="white" transition="all 0.3s" _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }} _focus={{ outline: 'none', borderColor: 'rgba(255, 255, 255, 0.5)', bg: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.1)' }} />
                    </Box>
                </Box>

                <Box mb="1.5rem">
                    <Box as="label" display="block" color="white" fontWeight="500" mb="0.5rem" fontSize="0.95rem" letterSpacing="0.5px">
                        Mot de passe
                    </Box>
                    <Box position="relative">
                        <Box position="absolute" left="1rem" top="50%" transform="translateY(-50%)" color="rgba(255, 255, 255, 0.6)" zIndex="1" pointerEvents="none">
                            <Lock size={18} />
                        </Box>
                        <Input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" _placeholder={{ color: 'rgba(255, 255, 255, 0.4)' }} w="100%" h="3.5rem" pl="3rem" bg="rgba(255, 255, 255, 0.05)" border="1px solid rgba(255, 255, 255, 0.1)" borderRadius="12px" fontSize="1rem" color="white" transition="all 0.3s" _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }} _focus={{ outline: 'none', borderColor: 'rgba(255, 255, 255, 0.5)', bg: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.1)' }} />
                    </Box>
                </Box>

                <Flex justify="flex-end" mb="2rem">
                    <Link href="#" onClick={(e) => { e.preventDefault(); handleForgotPassword(); }} fontSize="0.9rem" color="rgba(255, 255, 255, 0.8)" fontWeight="500" _hover={{ color: 'white', textDecoration: 'underline' }}>
                        Mot de passe oublié ?
                    </Link>
                </Flex>

                {error && (
                    <Box mb="1.5rem" p="0.875rem" borderRadius="12px" bg="rgba(220, 38, 38, 0.2)" backdropFilter="blur(8px)" border="1px solid rgba(220, 38, 38, 0.3)" color="#ff8a8a" fontSize="0.9rem" fontWeight="500" textAlign="center">
                        {error}
                    </Box>
                )}

                {info && (
                    <Box mb="1.5rem" p="0.875rem" borderRadius="12px" bg="rgba(5, 199, 226, 0.2)" backdropFilter="blur(8px)" border="1px solid rgba(5, 199, 226, 0.3)" color="#8ee2f1" fontSize="0.9rem" fontWeight="500" textAlign="center">
                        {info}
                    </Box>
                )}

                <Button type="submit" w="100%" h="3.5rem" bg="white" color="primary" borderRadius="12px" fontSize="1.1rem" fontWeight="600" transition="all 0.3s ease" _hover={{ bg: 'rgba(255, 255, 255, 0.9)', transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)' }} _active={{ transform: 'translateY(0)' }} disabled={isSubmitting} loading={isSubmitting} loadingText="Connexion...">
                    Se connecter
                </Button>
            </form>
        </Box>
    );
};