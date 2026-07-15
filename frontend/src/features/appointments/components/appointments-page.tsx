import { Pencil, Trash2, Calendar, CheckCircle, Clock, Check } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Badge } from 'src/shared/ui/badge';
import { Button } from 'src/shared/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from 'src/shared/ui/card';
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from 'src/shared/ui/table';
import { AppointmentModal } from './modals/appointment-modal';
import type { Appointment } from '../../../shared/model';
import { DataTable } from 'src/shared/ui/data-table';
import { toaster } from 'src/shared/ui/toaster';
import { cn } from 'src/shared/lib/utils';

const statusVariant: Record<string, 'warning' | 'success' | 'secondary' | 'destructive'> = {
  PENDING: 'warning',
  'En attente': 'warning',
  CONFIRMED: 'success',
  Confirmé: 'success',
  COMPLETED: 'secondary',
  Terminé: 'secondary',
  Annulé: 'destructive',
};

export const AppointmentsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('Tous');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [tempStatus, setTempStatus] = useState<string>('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        service: 'Consultation générale'
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';

    const fetchAppointments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiBase}/appointments?page=${currentPage}&size=5`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            const content = data.content || data;
            const meta = data.totalPages !== undefined ? data : { totalPages: 1, totalElements: content.length };
            const mapped: Appointment[] = content.map((app: {
                id: string;
                appointmentDate: string;
                status: Appointment['status'];
                user?: { firstName: string; lastName: string; email: string; phone: string };
                service?: { name: string };
            }) => {
                const dateStr = app.appointmentDate || '';
                const dateObj = dateStr ? new Date(dateStr) : new Date();
                return {
                    id: app.id || '',
                    patient: app.user ? `${app.user.firstName} ${app.user.lastName}` : 'Inconnu',
                    email: app.user ? app.user.email : '',
                    phone: app.user ? app.user.phone : '',
                    service: app.service ? app.service.name : 'Service inconnu',
                    date: dateStr ? dateStr.split('T')[0] : '',
                    time: dateStr ? dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
                    status: app.status || 'En attente'
                };
            });

            setAppointments(mapped);
            setFilteredAppointments(mapped);
            setTotalPages(meta.totalPages);
            setTotalElements(meta.totalElements);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setIsLoading(false);
        }
    }, [apiBase, currentPage]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        setIsUpdating(true);
        try {
            const response = await fetch(`${apiBase}/appointments/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update status');
            fetchAppointments();
            setIsModalOpen(false);
            setSelectedAppointment(null);
            toaster.create({ title: 'Succès', description: 'Statut mis à jour avec succès !', type: 'success' });
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const openEditModal = (app: Appointment) => {
        setSelectedAppointment(app);
        setTempStatus(app.status);
        setIsModalOpen(true);
    };

    const handleCreateAppointment = async () => {
        setIsUpdating(true);
        try {
            const response = await fetch(`${apiBase}/appointments/public`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAppointment),
            });

            if (!response.ok) throw new Error('Failed to create appointment');

            fetchAppointments();
            setIsModalOpen(false);
            setNewAppointment({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                date: '',
                time: '',
                service: 'Consultation générale'
            });
            toaster.create({ title: 'Succès', description: 'Rendez-vous créé avec succès !', type: 'success' });
        } catch (error) {
            console.error('Error creating appointment:', error);
        } finally {
            setIsUpdating(false);
        }
    };
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const handleSearch = (value: string) => {
        setSearchValue(value);
        applyFilters(value, statusFilter, appointments);
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        applyFilters(searchValue, status, appointments);
    };

    const applyFilters = (search: string, status: string, allApps: Appointment[]) => {
        let filtered = allApps;
        if (search) {
            filtered = filtered.filter(
                (app) =>
                    app.patient.toLowerCase().includes(search.toLowerCase()) ||
                    app.email.toLowerCase().includes(search.toLowerCase()) ||
                    app.service.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (status !== 'Tous') {
            filtered = filtered.filter((app) => app.status === status || 
                (status === 'Confirmé' && app.status === 'CONFIRMED') ||
                (status === 'En attente' && app.status === 'PENDING') ||
                (status === 'Terminé' && app.status === 'COMPLETED')
            );
        }

        setFilteredAppointments(filtered);
    };

    const confirmedCount = appointments.filter(app => app.status === 'Confirmé' || app.status === 'CONFIRMED').length;
    const pendingCount = appointments.filter(app => app.status === 'En attente' || app.status === 'PENDING').length;
    const completedCount = appointments.filter(app => app.status === 'Terminé' || app.status === 'COMPLETED').length;

    const statusOptions = ['Tous', 'Confirmé', 'En attente', 'Terminé', 'Annulé'];

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total RDV</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{appointments.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Confirmés</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{confirmedCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">En attente</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{pendingCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Terminés</CardTitle>
                        <Check className="h-4 w-4 text-[var(--accent)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[var(--accent)]">{completedCount}</div>
                    </CardContent>
                </Card>
            </div>

            <DataTable
                title="Tous les rendez-vous"
                subtitle={`${totalElements} rendez-vous au total`}
                onAdd={() => setIsModalOpen(true)}
                addButtonText="Nouveau RDV"
                searchPlaceholder="Rechercher un patient, service..."
                searchValue={searchValue}
                onSearch={handleSearch}
                filters={
                    <div className="flex gap-3 flex-wrap">
                        {statusOptions.map((status) => (
                            <Button
                                key={status}
                                variant={statusFilter === status ? "default" : "outline"}
                                onClick={() => handleStatusFilter(status)}
                                className={cn(
                                    "px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-300",
                                    statusFilter === status
                                        ? "bg-[var(--primary)] text-white border-[var(--primary)] hover:bg-[rgba(10,77,104,0.9)] hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(10,77,104,0.15)]"
                                        : "bg-white text-[var(--primary)] border-[rgba(10,77,104,0.2)] hover:bg-[rgba(10,77,104,0.05)] hover:-translate-y-0.5"
                                )}
                            >
                                {status}
                            </Button>
                        ))}
                    </div>
                }
                isLoading={isLoading}
                isEmpty={!isLoading && filteredAppointments.length === 0}
                emptyMessage="Aucun rendez-vous trouvé"
                emptySubMessage=""
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            >
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Réf</TableHead>
                            <TableHead>Patient</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Date & Heure</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAppointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                                <TableCell className="font-medium text-muted-foreground">
                                    {appointment.id.substring(0, 8)}
                                </TableCell>
                                <TableCell className="font-semibold">
                                    {appointment.patient}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="text-sm">{appointment.email}</p>
                                        <p className="text-xs text-muted-foreground">{appointment.phone}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {appointment.service}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{formatDate(appointment.date)}</p>
                                        <p className="text-xs text-muted-foreground">à {appointment.time}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusVariant[appointment.status]}>{appointment.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openEditModal(appointment)} 
                                            className="p-2 bg-[rgba(5,199,226,0.1)] text-[var(--accent)] rounded-md hover:bg-[rgba(5,199,226,0.2)] transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost"
                                            size="icon"
                                            className="p-2 bg-red-600/10 text-red-600 rounded-md hover:bg-red-600/20 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DataTable>

            <AppointmentModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedAppointment(null); }}
                selectedAppointment={selectedAppointment}
                tempStatus={tempStatus}
                setTempStatus={setTempStatus}
                isUpdating={isUpdating}
                handleUpdateStatus={handleUpdateStatus}
                newAppointment={newAppointment}
                setNewAppointment={setNewAppointment}
                handleCreateAppointment={handleCreateAppointment}
            />

        </div>
    );
};