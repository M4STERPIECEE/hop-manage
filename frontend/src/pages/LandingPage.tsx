import { Box } from '@chakra-ui/react';
import { Header } from '../components/common/Header';
import { HeroSection } from '../components/landing/HeroSection';
import { ServicesSection } from '../components/landing/ServicesSection';

export const LandingPage = () => {
    return (
        <Box minH="100vh" display="flex" flexDirection="column">
            <Header />
            <HeroSection />
            <ServicesSection />
        </Box>
    );
};
