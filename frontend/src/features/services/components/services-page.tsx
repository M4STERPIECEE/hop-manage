import { toaster } from '../../../shared/ui/toaster';
import { Pencil, CheckCircle, Clock, DollarSign, Smile } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from 'src/shared/ui/badge';
import { Button } from 'src/shared/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from 'src/shared/ui/card';
import { ServiceModal } from './modals/service-modal';
import { API_ENDPOINTS } from '../../../shared/api/api';
import { DataTable } from 'src/shared/ui/data-table';

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
    const [categoryFilter] = useState<string>('Tous');
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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                        <Smile className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalServices}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Services Actifs</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{activeServices}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Durée Moyenne</CardTitle>
                        <Clock className="h-4 w-4 text-[var(--accent)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[var(--accent)]">{avgDuration} min</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Prix Moyen</CardTitle>
                        <DollarSign className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{formatPrice(avgPrice)}</div>
                    </CardContent>
                </Card>
            </div>

            <DataTable<ServiceApi>
                columns={[
                    { id: 'service', header: 'Service', headerClassName: 'min-w-[250px]', cell: (row) => (
                        <div className="flex items-center gap-3 font-semibold">
                            <div className="bg-[rgba(5,199,226,0.1)] p-2 rounded-lg text-[var(--accent)]">
                                <Smile className="w-5 h-5" />
                            </div>
                            {row.name}
                        </div>
                    )},
                    { id: 'duration', header: 'Durée', cell: (row) => (
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[var(--accent)]" />
                            <span className="font-medium">{row.durationMinutes} min</span>
                        </div>
                    )},
                    { id: 'price', header: 'Prix', cell: (row) => <span className="font-bold">{formatPrice(row.price)}</span> },
                    { id: 'status', header: 'Statut', cell: (row) => (
                        <Badge variant={row.status === 'Actif' ? 'success' : 'neutral'}>
                            {row.status || 'Actif'}
                        </Badge>
                    )},
                    { id: 'actions', header: 'Actions', cell: (row) => (
                        <Button variant="ghost" size="icon" title="Modifier" onClick={() => openEditModal(row)}
                            className="p-2 bg-[rgba(5,199,226,0.1)] border border-[rgba(5,199,226,0.2)] text-[var(--accent)] rounded-md hover:bg-[rgba(5,199,226,0.2)] hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(5,199,226,0.3)] transition-all">
                            <Pencil className="w-4 h-4" />
                        </Button>
                    )},
                ]}
                data={filteredServices}
                getRowId={(row) => row.id}
                isLoading={isLoading}
                emptyMessage="Aucun service trouvé"
            />

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