import { useState, useEffect, type ElementType } from 'react';
import { API_ENDPOINTS } from 'src/shared/api/api';
import { Search, Sparkles, Gem, Smile, Crosshair, AlertTriangle } from 'lucide-react';
import { Spinner } from 'src/shared/ui/spinner';
import { Card, CardTitle, CardContent } from 'src/shared/ui/card';

interface ServiceWithIcon {
    id: string;
    name: string;
    description: string;
    icon: ElementType;
}

const serviceIcons: Record<string, ElementType> = {
    'Consultation generale': Search,
    'Detartrage': Sparkles,
    'Blanchiment': Gem,
    'Implant dentaire': Smile,
    'Orthodontie': Crosshair,
    'Urgence': AlertTriangle,
};

export const ServicesSection = () => {
    const [services, setServices] = useState<ServiceWithIcon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.services);
                if (response.ok) {
                    const data = await response.json();
                    const servicesWithIcons = data.map((service: { id: string; name: string; description: string }) => ({
                        ...service,
                        icon: serviceIcons[service.name] || Smile,
                    }));
                    setServices(servicesWithIcons);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    if (loading) {
        return (
            <section className="py-20 px-8 max-w-[1400px] mx-auto flex justify-center items-center min-h-[400px]" id="services">
                <Spinner className="w-12 h-12 text-[var(--primary)]" />
            </section>
        );
    }

    return (
        <section className="py-20 px-8 max-w-[1400px] mx-auto" id="services">
            <h2 className="font-poppins text-4xl md:text-[2.8rem] text-center text-[var(--primary)] font-bold mb-12">
                Nos Services
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                    <Card key={service.id} hoverable className="p-6">
                        <div className="w-[60px] h-[60px] bg-[var(--accent-soft)] rounded-xl flex items-center justify-center text-3xl mb-6">
                            <service.icon className="w-7 h-7 text-[var(--primary)]" />
                        </div>
                        <CardTitle className="font-poppins text-2xl mb-3">
                            {service.name}
                        </CardTitle>
                        <CardContent className="p-0 text-[var(--text-gray)] leading-relaxed">
                            {service.description}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
};