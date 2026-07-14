import { Box, Button, Grid, Heading, Input, Text, Flex, Icon, chakra } from '@chakra-ui/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { BookingFormData } from '../../types';
import { FiUser, FiMail, FiPhone, FiCalendar, FiClock, FiActivity, FiArrowLeft, FiCheck } from 'react-icons/fi';

export const BookingForm = () => {
    const [step, setStep] = useState<'form' | 'summary'>('form');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<BookingFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        service: '',
    });

    const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';

    const handleNextStep = (e: FormEvent) => {
        e.preventDefault();
        setStep('summary');
    };

    const handleConfirmBooking = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await fetch(`${apiBase}/appointments/public`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la réservation');
            }

            setSuccess(true);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                date: '',
                time: '',
                service: '',
            });
            setTimeout(() => {
                setSuccess(false);
                setStep('form');
            }, 5000);
        } catch {
            setError("Impossible de confirmer le rendez-vous. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const today = new Date().toISOString().split('T')[0];

    if (success) {
        return (
            <Box
                bg="white"
                borderRadius="16px"
                p="3rem"
                boxShadow="0 10px 30px rgba(10, 77, 104, 0.15)"
                textAlign="center"
                css={{ animation: 'fadeIn 0.5s ease-out' }}
            >
                <Box bg="success" w="4rem" h="4rem" borderRadius="full" display="flex" alignItems="center" justifyContent="center" mx="auto" mb="1.5rem">
                    <FiCheck size={32} color="white" />
                </Box>
                <Heading as="h2" color="primary" mb="1rem">Rendez-vous confirmé !</Heading>
                <Text color="textGray" fontSize="1.1rem">
                    Votre demande a été enregistrée avec succès. Notre équipe vous contactera sous peu pour confirmer l'horaire précis.
                </Text>
                <Button 
                    mt="2rem" 
                    variant="ghost" 
                    color="primary" 
                    onClick={() => { setSuccess(false); setStep('form'); }}
                >
                    Retour à l'accueil
                </Button>
            </Box>
        );
    }

    if (step === 'summary') {
        return (
            <Box
                bg="white"
                borderRadius="16px"
                p="2.5rem"
                boxShadow="0 10px 30px rgba(10, 77, 104, 0.15)"
                color="textDark"
                css={{
                    animation: 'fadeInRight 0.5s ease-out'
                }}
            >
                <Flex align="center" mb="2rem" gap="1rem">
                    <Button 
                        variant="ghost" 
                        onClick={() => setStep('form')} 
                        p="0.5rem" 
                        borderRadius="full"
                        _hover={{ bg: 'rgba(10, 77, 104, 0.05)', color: 'primary' }}
                    >
                        <FiArrowLeft size={20} />
                    </Button>
                    <Heading as="h2" fontFamily="'Crimson Pro', serif" color="primary" fontSize="2rem">
                        Confirmation
                    </Heading>
                </Flex>

                <Text mb="1.5rem" color="rgba(10, 77, 104, 0.7)" fontSize="0.95rem">
                    Veuillez vérifier vos informations avant la confirmation finale.
                </Text>

                <Grid templateColumns="1fr" gap="0.75rem" mb="2.5rem">
                    <SummaryItem icon={FiUser} label="Patient" value={`${formData.firstName} ${formData.lastName}`} />
                    <SummaryItem icon={FiMail} label="Email" value={formData.email} />
                    <SummaryItem icon={FiPhone} label="Téléphone" value={formData.phone} />
                    <SummaryItem icon={FiCalendar} label="Date" value={formData.date ? new Date(formData.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''} />
                    <SummaryItem icon={FiClock} label="Heure" value={formData.time} />
                    <SummaryItem icon={FiActivity} label="Service" value={formData.service} />
                </Grid>

                {error && (
                    <Text color="danger" mb="1rem" fontSize="0.9rem" textAlign="center" fontWeight="500">
                        {error}
                    </Text>
                )}

                <Button
                    onClick={handleConfirmBooking}
                    loading={isSubmitting}
                    bg="primary"
                    color="white"
                    h="3.5rem"
                    w="100%"
                    borderRadius="12px"
                    fontSize="1.1rem"
                    fontWeight="600"
                    transition="all 0.3s"
                    _hover={{ 
                        bg: 'primaryDark', 
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(10, 77, 104, 0.2)'
                    }}
                >
                    <FiCheck style={{ marginRight: '8px' }} /> Confirmer le rendez-vous
                </Button>
            </Box>
        );
    }

    return (
        <Box
            bg="white"
            borderRadius="16px"
            p="2.5rem"
            boxShadow="0 10px 30px rgba(10, 77, 104, 0.15)"
            color="textDark"
            css={{
                animation: 'fadeInUp 0.8s ease-out 0.3s backwards',
            }}
        >
            <Heading
                as="h2"
                fontFamily="'Crimson Pro', serif"
                color="primary"
                fontSize="2rem"
                mb="1.5rem"
            >
                Réserver un rendez-vous
            </Heading>

            <form onSubmit={handleNextStep}>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="1rem" mb="1.5rem">
                    <Box>
                        <Box as="label" display="block" color="textDark" fontWeight="600" mb="0.5rem" fontSize="0.95rem">
                            Prénom
                        </Box>
                        <Input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
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
                    <Box>
                        <Box as="label" display="block" color="textDark" fontWeight="600" mb="0.5rem" fontSize="0.95rem">
                            Nom
                        </Box>
                        <Input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
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
                </Grid>

                <Box mb="1.5rem">
                    <Box as="label" display="block" color="textDark" fontWeight="600" mb="0.5rem" fontSize="0.95rem">
                        Email
                    </Box>
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
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
                    <Box as="label" display="block" color="textDark" fontWeight="600" mb="0.5rem" fontSize="0.95rem">
                        Téléphone
                    </Box>
                    <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
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

                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="1rem" mb="1.5rem">
                    <Box>
                        <Box as="label" display="block" color="textDark" fontWeight="600" mb="0.5rem" fontSize="0.95rem">
                            Date
                        </Box>
                        <Input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={today}
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
                    <Box>
                        <Box as="label" display="block" color="textDark" fontWeight="600" mb="0.5rem" fontSize="0.95rem">
                            Heure
                        </Box>
                        <Input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
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
                </Grid>

                <Box mb="1.5rem">
                    <Box as="label" display="block" color="textDark" fontWeight="600" mb="0.5rem" fontSize="0.95rem">
                        Type de soin
                    </Box>
                    <chakra.select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        color={formData.service ? "textDark" : "gray.500"}
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
                        css={{
                            appearance: 'auto',
                            backgroundColor: 'white',
                        }}
                    >
                        <option value="" disabled style={{ color: '#a0a0a0' }}>
                            Sélectionnez un service
                        </option>
                        <option value="Consultation generale">Consultation generale</option>
                        <option value="Detartrage">Detartrage</option>
                        <option value="Blanchiment">Blanchiment</option>
                        <option value="Implant dentaire">Implant dentaire</option>
                        <option value="Orthodontie">Orthodontie</option>
                        <option value="Urgence">Urgence</option>
                    </chakra.select>
                </Box>
                <Button
                    type="submit"
                    bg="primary"
                    color="white"
                    p="1rem 2rem"
                    border="none"
                    borderRadius="8px"
                    fontSize="1.1rem"
                    fontWeight="600"
                    cursor="pointer"
                    w="100%"
                    transition="all 0.3s"
                    boxShadow="0 1px 3px rgba(10, 77, 104, 0.08)"
                    _hover={{
                        bg: 'primaryDark',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(10, 77, 104, 0.12)',
                    }}
                >
                    Continuer
                </Button>
            </form>
        </Box>
    );
};

const SummaryItem = ({ icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
    <Flex align="center" p="0.8rem 1rem" bg="rgba(10, 77, 104, 0.03)" borderRadius="10px" gap="1rem" border="1px solid rgba(10, 77, 104, 0.05)">
        <Icon as={icon} color="accent" boxSize="1.2rem" />
        <Box>
            <Text fontSize="0.7rem" color="rgba(10, 77, 104, 0.5)" fontWeight="700" textTransform="uppercase" letterSpacing="0.5px">
                {label}
            </Text>
            <Text color="primary" fontWeight="700" fontSize="1rem">
                {value}
            </Text>
        </Box>
    </Flex>
);
