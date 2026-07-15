import { toaster } from '../../../shared/ui/toaster';
import { Pencil, CheckCircle, Clock, DollarSign, Smile } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../../../shared/ui/badge';
import { ServiceModal } from './modals/service-modal';
import { API_ENDPOINTS } from '../../../shared/api/api';
import { DataTable } from '../../../shared/ui/data-table';
import { cn } from '../../../shared/lib/utils';

type ServiceApi = {
    id: string;
    name: string;
    description?: string | null;
    durationMinutes: number;
    price: number;
    status?: 'Actif' | 'Inactif' | string | null;
};

export const ServicesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<string>('Tous');
    const [servicesData, setServicesData] = useState<ServiceApi[]>([]);
    const [filteredServices, setFilteredServices] = useState<ServiceApi[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<ServiceApi | null>(null);
    const [editForm, setEditForm] = useState({
        durationMinutes: '',
        price: '',
        status: 'Actif',
    });
    const [isUpdating, setIsUpdating] = useState(false);

    const totalServices = servicesData.length;
    const activeServices = servicesData.filter(s => (s.status || 'Actif') === 'Actif').length;
    const totalDuration = servicesData.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const avgDuration = totalServices > 0 ? Math.round(totalDuration / totalServices) : 0;
    const totalPrice = servicesData.reduce((acc, s) => acc + (Number(s.price) || 0), 0);
    const avgPrice = totalServices > 0 ? Math.round(totalPrice / totalServices) : 0;
    const formatPrice = (value: number) => new Intl.NumberFormat('fr-MG', {
        style: 'currency',
        currency: 'MGA',
        maximumFractionDigits: 0,
    }).format(value);

    const categories = ['Tous', 'Consultation', 'Nettoyage', 'Esthétique', 'Chirurgie'];

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (categoryFilter === 'Tous') {
            setFilteredServices(servicesData);
            return;
        }

        const filtered = servicesData.filter(s =>
            s.name.toLowerCase().includes(categoryFilter.toLowerCase())
        );
        setFilteredServices(filtered.length > 0 ? filtered : servicesData);
    }, [categoryFilter, servicesData]);

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.services);
            if (!response.ok) throw new Error('Failed to fetch services');
            const data = await response.json();
            const mapped: ServiceApi[] = (Array.isArray(data) ? data : []).map((service: {
                id: string;
                name: string;
                description?: string | null;
                durationMinutes?: number;
                duration?: number;
                price: number;
                status?: string | null;
            }) => ({
                id: service.id,
                name: service.name,
                description: service.description ?? null,
                durationMinutes: Number(service.durationMinutes ?? service.duration) || 0,
                price: Number(service.price) || 0,
                status: service.status ?? 'Actif',
            }));
            setServicesData(mapped);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryFilter = (category: string) => {
        setCategoryFilter(category);
    };

    const openEditModal = (service: ServiceApi) => {
        setSelectedService(service);
        setEditForm({
            durationMinutes: String(service.durationMinutes ?? ''),
            price: String(service.price ?? ''),
            status: service.status ?? 'Actif',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedService(null);
    };

    const handleUpdateService = async () => {
        if (!selectedService) return;

        const durationMinutes = Number(editForm.durationMinutes);
        const price = Number(editForm.price);
        if (!durationMinutes || !price) return;

        setIsUpdating(true);
        try {
            const response = await fetch(`${API_ENDPOINTS.services}/${selectedService.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    durationMinutes,
                    price,
                    status: editForm.status,
                }),
            });

            if (!response.ok) throw new Error('Failed to update service');
            await fetchServices();
            closeModal();
            toaster.create({
                title: 'Succès',
                description: 'Le service a été modifié avec succès',
                type: 'success',
            });
        } catch (error) {
            console.error('Error updating service:', error);
            toaster.create({
                title: 'Erreur',
                description: 'Échec de la modification du service',
                type: 'error',
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-white p-6 rounded-xl border border-[rgba(10,77,104,0.1)] shadow-[0_2px_8px_rgba(10,77,104,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(10,77,104,0.12)]">
                    <div className="flex items-center gap-3 mb-2">
                        <Smile className="w-8 h-8 text-[var(--accent)]" />
                        <p className="text-[0.85rem] font-semibold text-[rgba(10,77,104,0.7)] uppercase tracking-wide">Total Services</p>
                    </div>
                    <p className="text-3xl font-bold text-[var(--primary)] font-poppins">{totalServices}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[rgba(34,197,94,0.2)] shadow-[0_2px_8px_rgba(34,197,94,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(34,197,94,0.15)]">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-8 h-8 text-[#22c55e]" />
                        <p className="text-[0.85rem] font-semibold text-[rgba(10,77,104,0.7)] uppercase tracking-wide">Services Actifs</p>
                    </div>
                    <p className="text-3xl font-bold text-[#22c55e] font-poppins">{activeServices}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[rgba(5,199,226,0.2)] shadow-[0_2px_8px_rgba(5,199,226,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(5,199,226,0.15)]">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-8 h-8 text-[var(--accent)]" />
                        <p className="text-[0.85rem] font-semibold text-[rgba(10,77,104,0.7)] uppercase tracking-wide">Durée Moyenne</p>
                    </div>
                    <p className="text-3xl font-bold text-[var(--accent)] font-poppins">{avgDuration} min</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[rgba(251,191,36,0.2)] shadow-[0_2px_8px_rgba(251,191,36,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(251,191,36,0.15)]">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="w-8 h-8 text-[#fbbf24]" />
                        <p className="text-[0.85rem] font-semibold text-[rgba(10,77,104,0.7)] uppercase tracking-wide">Prix Moyen</p>
                    </div>
                    <p className="text-3xl font-bold text-[#fbbf24] font-poppins">{formatPrice(avgPrice)}</p>
                </div>
            </div>

            <DataTable
                title="Services disponibles"
                subtitle={`${filteredServices.length} service${filteredServices.length > 1 ? 's' : ''} disponible${filteredServices.length > 1 ? 's' : ''}`}
                filters={
                    <div className="flex gap-3 flex-wrap">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryFilter(category)}
                                className={cn(
                                    "px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-300",
                                    categoryFilter === category
                                        ? "bg-[var(--primary)] text-white border-[var(--primary)] hover:bg-[rgba(10,77,104,0.9)] hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(10,77,104,0.15)]"
                                        : "bg-white text-[var(--primary)] border-[rgba(10,77,104,0.2)] hover:bg-[rgba(10,77,104,0.05)] hover:-translate-y-0.5"
                                )}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                }
                isLoading={isLoading}
                isEmpty={!isLoading && filteredServices.length === 0}
                emptyMessage="Aucun service trouvé"
                emptySubMessage=""
            >
                <div className="w-full">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[rgba(10,77,104,0.04)] border-b border-[var(--border)]">
                            <tr>
                                <th className="py-4 px-5 text-[0.85rem] font-bold text-[var(--primary)] uppercase tracking-wider min-w-[250px]">Service</th>
                                <th className="py-4 px-5 text-[0.85rem] font-bold text-[var(--primary)] uppercase tracking-wider">Durée</th>
                                <th className="py-4 px-5 text-[0.85rem] font-bold text-[var(--primary)] uppercase tracking-wider">Prix</th>
                                <th className="py-4 px-5 text-[0.85rem] font-bold text-[var(--primary)] uppercase tracking-wider">Statut</th>
                                <th className="py-4 px-5 text-[0.85rem] font-bold text-[var(--primary)] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {filteredServices.map((service) => (
                                <tr key={service.id} className="hover:bg-[rgba(5,199,226,0.04)] transition-colors">
                                    <td className="py-4 px-5 font-semibold text-[var(--primary)] text-[0.95rem]">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[rgba(5,199,226,0.1)] p-2 rounded-lg text-[var(--accent)]">
                                                <Smile className="w-5 h-5" />
                                            </div>
                                            {service.name}
                                        </div>
                                    </td>
                                    <td className="py-4 px-5 text-[0.9rem] text-[rgba(10,77,104,0.8)]">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-[var(--accent)]" />
                                            <span className="font-medium">{service.durationMinutes} min</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5 text-[0.95rem] font-bold text-[var(--primary)]">
                                        {formatPrice(service.price)}
                                    </td>
                                    <td className="py-4 px-5">
                                        <Badge variant={service.status === 'Actif' ? 'success' : 'secondary'}>
                                            {service.status || 'Actif'}
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-5">
                                        <button 
                                            title="Modifier" 
                                            onClick={() => openEditModal(service)}
                                            className="p-2 bg-[rgba(5,199,226,0.1)] border border-[rgba(5,199,226,0.2)] text-[var(--accent)] rounded-md hover:bg-[rgba(5,199,226,0.2)] hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(5,199,226,0.3)] transition-all"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DataTable>

            <ServiceModal
                isOpen={isModalOpen}
                onClose={closeModal}
                editForm={editForm}
                setEditForm={setEditForm}
                handleUpdateService={handleUpdateService}
                isUpdating={isUpdating}
            />
        </div>
    );
};