import { Box, Button, Grid, Heading, Input } from '@chakra-ui/react';

export const SettingsPage = () => {
    return (
        <Box bg="white" borderRadius="12px" boxShadow="0 1px 3px rgba(10, 77, 104, 0.08)" overflow="hidden">
            <Box px="2rem" py="1.5rem" borderBottom="2px solid var(--border)">
                <Heading
                    as="h2"
                    fontFamily="'Crimson Pro', serif"
                    fontSize="1.5rem"
                    color="primary"
                >
                    Paramètres du cabinet
                </Heading>
            </Box>

            <Box p="2rem">
                <Box mb="1.5rem">
                    <Box as="label" display="block" color="textDark" fontWeight="600" mb="0.5rem">
                        Nom du cabinet
                    </Box>
                    <Input
                        type="text"
                        defaultValue="DentiCare"
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
                    <Box as="label" display="block" color="textDark" fontWeight="600" mb="0.5rem">
                        Adresse
                    </Box>
                    <Input
                        type="text"
                        defaultValue="123 Avenue de la Santé, Paris"
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
                        <Box as="label" display="block" color="textDark" fontWeight="600" mb="0.5rem">
                            Téléphone
                        </Box>
                        <Input
                            type="tel"
                            defaultValue="01 23 45 67 89"
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
                        <Box as="label" display="block" color="textDark" fontWeight="600" mb="0.5rem">
                            Email
                        </Box>
                        <Input
                            type="email"
                            defaultValue="contact@denticare.fr"
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

                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="1rem" mb="1.5rem">
                    <Box>
                        <Box as="label" display="block" color="textDark" fontWeight="600" mb="0.5rem">
                            Heure d'ouverture
                        </Box>
                        <Input
                            type="time"
                            defaultValue="08:00"
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
                        <Box as="label" display="block" color="textDark" fontWeight="600" mb="0.5rem">
                            Heure de fermeture
                        </Box>
                        <Input
                            type="time"
                            defaultValue="18:00"
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

                <Button
                    bg="primary"
                    color="white"
                    px="2rem"
                    py="1rem"
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
                    Enregistrer les modifications
                </Button>
            </Box>
        </Box>
    );
};
