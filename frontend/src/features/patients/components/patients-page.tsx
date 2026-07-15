import { useState, useEffect, useCallback } from 'react';
import { PatientModal } from './modals/patient-modal';
import type { Patient } from '../../../shared/model';
import { DataTable } from '../../../shared/ui/data-table';
import { Users, UserCheck, UserPlus } from 'lucide-react';

export const PatientsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';

    const fetchPatients = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiBase}/users/patients?page=${currentPage}&size=5`);
            if (!response.ok) throw new Error('Failed to fetch patients');
            const data = await response.json();

            const content = data.content || [];
            const mapped: Patient[] = content.map((user: {
                id: string | number;
                firstName: string;
                lastName: string;
                email: string;
                phone?: string;
                updatedAt?: string;
                createdAt?: string;
            }) => ({
                id: Number(user.id) || 0,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email || '',
                phone: user.phone || 'Non renseigné',
                lastVisit: user.updatedAt || user.createdAt || new Date().toISOString()
            }));

            setPatients(mapped);
            setFilteredPatients(mapped);
            setTotalPages(data.totalPages || 1);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setIsLoading(false);
        }
    }, [apiBase, currentPage]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const handleSearch = (value: string) => {
        setSearchValue(value);
        const filtered = patients.filter(
            (patient) =>
                patient.name.toLowerCase().includes(value.toLowerCase()) ||
                patient.email.toLowerCase().includes(value.toLowerCase()) ||
                patient.phone.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredPatients(filtered);
    };
    const totalPatientsCount = totalElements;
    const activePatientsCount = patients.length;
    const newThisMonthCount = patients.filter(p => {
        const d = new Date(p.lastVisit);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                <div className="bg-white p-6 rounded-xl border border-[rgba(10,77,104,0.1)] shadow-[0_2px_8px_rgba(10,77,104,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(10,77,104,0.12)]">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-6 h-6 text-[var(--primary)]" />
                        <p className="text-[0.85rem] font-semibold text-[rgba(10,77,104,0.7)] uppercase tracking-wide">Total Patients</p>
                    </div>
                    <p className="text-3xl font-bold text-[var(--primary)] font-poppins">{totalPatientsCount}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[rgba(5,199,226,0.2)] shadow-[0_2px_8px_rgba(5,199,226,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(5,199,226,0.15)]">
                    <div className="flex items-center gap-3 mb-2">
                        <UserCheck className="w-6 h-6 text-[var(--accent)]" />
                        <p className="text-[0.85rem] font-semibold text-[rgba(10,77,104,0.7)] uppercase tracking-wide">Patients récents</p>
                    </div>
                    <p className="text-3xl font-bold text-[var(--accent)] font-poppins">{activePatientsCount}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[rgba(34,197,94,0.2)] shadow-[0_2px_8px_rgba(34,197,94,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(34,197,94,0.15)]">
                    <div className="flex items-center gap-3 mb-2">
                        <UserPlus className="w-6 h-6 text-[#22c55e]" />
                        <p className="text-[0.85rem] font-semibold text-[rgba(10,77,104,0.7)] uppercase tracking-wide">Nouveaux ce mois</p>
                    </div>
                    <p className="text-3xl font-bold text-[#22c55e] font-poppins">{newThisMonthCount}</p>
                </div>
            </div>

            <DataTable
                title="Liste des patients"
                subtitle={`${totalElements} patient${totalElements > 1 ? 's' : ''} au total`}
                searchPlaceholder="Rechercher un patient..."
                searchValue={searchValue}
                onSearch={handleSearch}
                isLoading={isLoading}
                isEmpty={!isLoading && filteredPatients.length === 0}
                emptyMessage="Aucun patient trouvé"
                emptySubMessage="Essayez de modifier vos critères de recherche"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            >
                <div className="w-full">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[rgba(10,77,104,0.04)] border-b border-[var(--border)]">
                            <tr>
                                <th className="py-4 px-5 text-[0.85rem] font-bold text-[var(--primary)] uppercase tracking-wider">ID</th>
                                <th className="py-4 px-5 text-[0.85rem] font-bold text-[var(--primary)] uppercase tracking-wider">Nom complet</th>
                                <th className="py-4 px-5 text-[0.85rem] font-bold text-[var(--primary)] uppercase tracking-wider">Email</th>
                                <th className="py-4 px-5 text-[0.85rem] font-bold text-[var(--primary)] uppercase tracking-wider">Téléphone</th>
                                <th className="py-4 px-5 text-[0.85rem] font-bold text-[var(--primary)] uppercase tracking-wider">Dernière visite</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-[rgba(5,199,226,0.04)] transition-colors">
                                    <td className="py-4 px-5 text-[0.85rem] font-bold text-[rgba(10,77,104,0.5)]">
                                        #{String(patient.id).substring(0, 8)}
                                    </td>
                                    <td className="py-4 px-5 text-[0.95rem] font-semibold text-[var(--primary)]">
                                        {patient.name}
                                    </td>
                                    <td className="py-4 px-5 text-[0.9rem] text-[rgba(10,77,104,0.7)]">
                                        {patient.email}
                                    </td>
                                    <td className="py-4 px-5 text-[0.9rem] font-medium text-[rgba(10,77,104,0.7)]">
                                        {patient.phone}
                                    </td>
                                    <td className="py-4 px-5 text-[0.9rem] text-[rgba(10,77,104,0.7)]">
                                        {formatDate(patient.lastVisit)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DataTable>

            <PatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};