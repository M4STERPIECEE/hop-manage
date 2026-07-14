import { Box, Grid, Heading, Text, Flex } from '@chakra-ui/react';
import { BookingForm } from './BookingForm.tsx';

export const HeroSection = () => {
    return (
        <Box
            as="section"
            bg="linear-gradient(135deg, var(--primary) 0%, #0a5d7a 100%)"
            color="white"
            py="6rem"
            px="2rem"
            position="relative"
            overflow="hidden"
            _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                opacity: 0.5,
            }}
        >
            <Grid
                maxW="1400px"
                mx="auto"
                templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
                gap="4rem"
                alignItems="center"
                position="relative"
                zIndex="1"
            >
                <Box>
                    <Heading
                        as="h1"
                        fontFamily="'Crimson Pro', serif"
                        fontSize={{ base: '2.5rem', md: '3.5rem' }}
                        fontWeight="700"
                        lineHeight="1.2"
                        mb="1.5rem"
                        css={{
                            animation: 'fadeInUp 0.8s ease-out',
                        }}
                    >
                        Prenez soin de votre sourire
                    </Heading>
                    <Text
                        fontSize="1.2rem"
                        opacity="0.9"
                        mb="2rem"
                        css={{
                            animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
                        }}
                    >
                        Réservez votre rendez-vous en quelques clics. Notre équipe de professionnels est là pour vous offrir les meilleurs soins dentaires.
                    </Text>

                    <Flex
                        gap="3rem"
                        mt="3rem"
                        justify={{ base: 'center', lg: 'flex-start' }}
                        css={{
                            animation: 'fadeInUp 0.8s ease-out 0.4s backwards',
                        }}
                    >
                        <Box textAlign="center">
                            <Text
                                as="span"
                                fontFamily="'Crimson Pro', serif"
                                fontSize="2.5rem"
                                fontWeight="700"
                                display="block"
                            >
                                15+
                            </Text>
                            <Text as="span" fontSize="0.9rem" opacity="0.8">
                                Années d'expérience
                            </Text>
                        </Box>
                        <Box textAlign="center">
                            <Text
                                as="span"
                                fontFamily="'Crimson Pro', serif"
                                fontSize="2.5rem"
                                fontWeight="700"
                                display="block"
                            >
                                5000+
                            </Text>
                            <Text as="span" fontSize="0.9rem" opacity="0.8">
                                Patients satisfaits
                            </Text>
                        </Box>
                        <Box textAlign="center">
                            <Text
                                as="span"
                                fontFamily="'Crimson Pro', serif"
                                fontSize="2.5rem"
                                fontWeight="700"
                                display="block"
                            >
                                98%
                            </Text>
                            <Text as="span" fontSize="0.9rem" opacity="0.8">
                                Taux de satisfaction
                            </Text>
                        </Box>
                    </Flex>
                </Box>

                <BookingForm />
            </Grid>
        </Box>
    );
};
