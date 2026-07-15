import { Box } from '@chakra-ui/react';
import { Header } from '../../../app/layout/header';
import { HeroSection } from './hero-section';
import { ServicesSection } from './services-section';

export const LandingPage = () => {
    return (
        <Box minH="100vh" display="flex" flexDirection="column">
            <Header />
            <HeroSection />
            <ServicesSection />
        </Box>
    );
};
