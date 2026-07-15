import { Pencil, Trash2, Calendar, CheckCircle, Clock, Check } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Badge } from '../../../shared/ui';
import { AppointmentModal } from './modals/appointment-modal';
import type { Appointment } from '../../../shared/model';

const statusVariant: Record<string, 'warning' | 'success' | 'secondary' | 'destructive'> = {
  PENDING: 'warning',
  'En attente': 'warning',
  CONFIRMED: 'success',
  Confirmé: 'success',
  COMPLETED: 'secondary',
  Terminé: 'secondary',
  Annulé: 'destructive',
};
import { DataTable } from '../../../shared/ui/data-table';
import { cn } from '../../../shared/lib/utils';

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
    const [showSuccessToast, setShowSuccessToast] = useState(false);
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
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 4000);
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
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 4000);
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
                <div className="bg-white p-6 rounded-xl border border-[rgba(10,77,104,0.1)] shadow-[0_2px_8px_rgba(10,77,104,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(10,77,104,0.12)]">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-6 h-6 text-[var(--primary)]" />
                        <p className="text-[0.85rem] font-semibold text-[rgba(10,77,104,0.7)] uppercase tracking-wide">
                            Total RDV
                        </p>
                    </div>
                    <p className="text-3xl font-bold text-[var(--primary)] font-poppins">
                        {appointments.length}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[rgba(34,197,94,0.2)] shadow-[0_2px_8px_rgba(34,197,94,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(34,197,94,0.15)]">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-6 h-6 text-[#22c55e]" />
                        <p className="text-[0.85rem] font-semibold text-[rgba(10,77,104,0.7)] uppercase tracking-wide">
                            Confirmés
                        </p>
                    </div>
                    <p className="text-3xl font-bold text-[#22c55e] font-poppins">
                        {confirmedCount}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[rgba(251,191,36,0.2)] shadow-[0_2px_8px_rgba(251,191,36,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(251,191,36,0.15)]">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-6 h-6 text-[#fbbf24]" />
                        <p className="text-[0.85rem] font-semibold text-[rgba(10,77,104,0.7)] uppercase tracking-wide">
                            En attente
                        </p>
                    </div>
                    <p className="text-3xl font-bold text-[#fbbf24] font-poppins">
                        {pendingCount}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[rgba(5,199,226,0.2)] shadow-[0_2px_8px_rgba(5,199,226,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(5,199,226,0.15)]">
                    <div className="flex items-center gap-3 mb-2">
                        <Check className="w-6 h-6 text-[var(--accent)]" />
                        <p className="text-[0.85rem] font-semibold text-[rgba(10,77,104,0.7)] uppercase tracking-wide">
                            Terminés
                        </p>
                    </div>
                    <p className="text-3xl font-bold text-[var(--accent)] font-poppins">
                        {completedCount}
                    </p>
                </div>
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
                            <button
                                key={status}
                                onClick={() => handleStatusFilter(status)}
                                className={cn(
                                    "px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-300",
                                    statusFilter === status
                                        ? "bg-[var(--primary)] text-white border-[var(--primary)] hover:bg-[rgba(10,77,104,0.9)] hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(10,77,104,0.15)]"
                                        : "bg-white text-[var(--primary)] border-[rgba(10,77,104,0.2)] hover:bg-[rgba(10,77,104,0.05)] hover:-translate-y-0.5"
                                )}
                            >
                                {status}
                            </button>
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
                <div className="w-full">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[rgba(10,77,104,0.04)] border-b border-[var(--border)]">
                            <tr>
                                <th className="py-4 px-5 text-[0.85rem] font-bold text-[var(--primary)] uppercase tracking-wider">Réf</th>
                                <th className="py-4 px-5 text-[0.85rem] font-bold text-[var(--primary)] uppercase tracking-wider">Patient</th>
                                <th className="py-4 px-5 text-[0.85rem] font-bold text-[var(--primary)] uppercase tracking-wider">Contact</th>
                                <th className="py-4 px-5 text-[0.85rem] font-bold text-[var(--primary)] uppercase tracking-wider">Service</th>
                                <th className="py-4 px-5 text-[0.85rem] font-bold text-[var(--primary)] uppercase tracking-wider">Date & Heure</th>
                                <th className="py-4 px-5 text-[0.85rem] font-bold text-[var(--primary)] uppercase tracking-wider">Statut</th>
                                <th className="py-4 px-5 text-[0.85rem] font-bold text-[var(--primary)] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {filteredAppointments.map((appointment) => (
                                <tr key={appointment.id} className="hover:bg-[rgba(5,199,226,0.04)] transition-colors">
                                    <td className="py-4 px-5 text-[0.8rem] font-bold text-[rgba(10,77,104,0.5)]">
                                        {appointment.id.substring(0, 8)}
                                    </td>
                                    <td className="py-4 px-5 text-[0.95rem] font-semibold text-[var(--primary)]">
                                        {appointment.patient}
                                    </td>
                                    <td className="py-4 px-5">
                                        <div>
                                            <p className="text-[0.85rem] text-[rgba(10,77,104,0.7)]">{appointment.email}</p>
                                            <p className="text-[0.8rem] text-[rgba(10,77,104,0.5)]">{appointment.phone}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5 text-[0.9rem] font-medium text-[rgba(10,77,104,0.8)]">
                                        {appointment.service}
                                    </td>
                                    <td className="py-4 px-5 text-[0.9rem] text-[rgba(10,77,104,0.7)]">
                                        <div>
                                            <p className="font-medium">{formatDate(appointment.date)}</p>
                                            <p className="text-[0.8rem] text-[rgba(10,77,104,0.5)]">à {appointment.time}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <Badge variant={statusVariant[appointment.status]}>{appointment.status}</Badge>
                                    </td>
                                    <td className="py-4 px-5">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => openEditModal(appointment)} 
                                                className="p-2 bg-[rgba(5,199,226,0.1)] text-[var(--accent)] rounded-md hover:bg-[rgba(5,199,226,0.2)] transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button 
                                                className="p-2 bg-red-600/10 text-red-600 rounded-md hover:bg-red-600/20 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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

            {showSuccessToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[rgba(16,185,129,0.95)] text-white py-4 px-8 rounded-xl shadow-[0_10px_25px_rgba(16,185,129,0.3)] flex items-center gap-3 z-[3000] animate-[fadeInUp_0.4s_ease-out]">
                    <Check className="w-5 h-5" />
                    <p className="font-semibold">Statut mis à jour avec succès !</p>
                </div>
            )}
        </div>
    );
};