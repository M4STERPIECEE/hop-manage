import { Box, Button, Heading, Input, Text, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const ResetPasswordForm = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
    const token = searchParams.get('token') ?? '';

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfo(null);

        if (!token) {
            setError('Token manquant. Verifiez le lien recu par email.');
            return;
        }
        if (!newPassword || newPassword.length < 8) {
            setError('Mot de passe trop court (8 caracteres minimum).');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${apiBase}/api/v1/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Erreur de reinitialisation.');
            }

            setInfo('Mot de passe mis a jour. Vous pouvez vous connecter.');
            setTimeout(() => navigate('/login'), 1200);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur de reinitialisation.');
        } finally {
            setIsSubmitting(false);
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
                Reinitialiser le mot de passe
            </Heading>
            <Text fontSize="0.95rem" color="rgba(10, 77, 104, 0.7)" mb="1.5rem">
                Saisissez votre nouveau mot de passe pour acceder au tableau de bord.
            </Text>

            <form onSubmit={handleSubmit}>
                <Box mb="1rem">
                    <Box
                        as="label"
                        display="block"
                        color="textDark"
                        fontWeight="600"
                        mb="0.5rem"
                        fontSize="0.95rem"
                    >
                        Nouveau mot de passe
                    </Box>
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        w="100%"
                        p="0.9rem"
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

                <Box mb="1.5rem">
                    <Box
                        as="label"
                        display="block"
                        color="textDark"
                        fontWeight="600"
                        mb="0.5rem"
                        fontSize="0.95rem"
                    >
                        Confirmer le mot de passe
                    </Box>
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        w="100%"
                        p="0.9rem"
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
                        w="70%"
                        transition="all 0.3s"
                        _hover={{
                            bg: 'primary',
                            color: 'white',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(10, 77, 104, 0.3)',
                        }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Mise a jour...' : 'Mettre a jour'}
                    </Button>
                </Flex>
            </form>
        </Box>
    );
};
