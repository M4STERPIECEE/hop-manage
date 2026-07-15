import { Header } from 'src/app/layout/header';
import { HeroSection } from './hero-section';
import { ServicesSection } from './services-section';

export const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <HeroSection />
            <ServicesSection />
        </div>
    );
};
