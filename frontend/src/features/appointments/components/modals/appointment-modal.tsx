import { Badge, Button, Input } from '../../../../shared/ui';
import { Modal } from '../../../../shared/ui';
import type { Appointment } from '../../../../shared/model';

const statusVariant: Record<string, 'warning' | 'success' | 'secondary' | 'destructive'> = {
  PENDING: 'warning',
  'En attente': 'warning',
  CONFIRMED: 'success',
  Confirmé: 'success',
  COMPLETED: 'secondary',
  Terminé: 'secondary',
  Annulé: 'destructive',
};

interface NewAppointment {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    service: string;
}

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedAppointment: Appointment | null;
    tempStatus: string;
    setTempStatus: (status: string) => void;
    isUpdating: boolean;
    handleUpdateStatus: (id: string, status: string) => void;
    newAppointment: NewAppointment;
    setNewAppointment: React.Dispatch<React.SetStateAction<NewAppointment>>;
    handleCreateAppointment: () => void;
}

export const AppointmentModal = ({
    isOpen,
    onClose,
    selectedAppointment,
    tempStatus,
    setTempStatus,
    isUpdating,
    handleUpdateStatus,
    newAppointment,
    setNewAppointment,
    handleCreateAppointment
}: AppointmentModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={selectedAppointment ? "Modifier le statut" : "Nouveau rendez-vous"}>
            {selectedAppointment ? (
                <div>
                    <p className="mb-4 font-semibold text-[var(--text-dark)]">
                        Patient: {selectedAppointment.patient}
                    </p>
                    <div className="mb-6 text-[var(--text-gray)] flex items-center gap-2">
                        Statut actuel: <Badge variant={statusVariant[selectedAppointment.status]}>{selectedAppointment.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {['En attente', 'Confirmé', 'Terminé', 'Annulé'].map((s) => (
                            <Button
                                key={s}
                                variant={tempStatus === s ? "default" : "outline"}
                                onClick={() => setTempStatus(s)}
                                disabled={isUpdating}
                                className="w-full"
                            >
                                {s}
                            </Button>
                        ))}
                    </div>

                    <Button 
                        className="w-full" 
                        onClick={() => handleUpdateStatus(selectedAppointment.id, tempStatus)} 
                        disabled={tempStatus === selectedAppointment.status || isUpdating}
                    >
                        {isUpdating ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </Button>
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block mb-1.5 font-semibold text-[0.9rem] text-[var(--text-dark)]">Prénom</label>
                            <Input 
                                placeholder="Prénom" 
                                value={newAppointment.firstName} 
                                onChange={(e) => setNewAppointment({ ...newAppointment, firstName: e.target.value })} 
                            />
                        </div>
                        <div>
                            <label className="block mb-1.5 font-semibold text-[0.9rem] text-[var(--text-dark)]">Nom</label>
                            <Input 
                                placeholder="Nom" 
                                value={newAppointment.lastName} 
                                onChange={(e) => setNewAppointment({ ...newAppointment, lastName: e.target.value })} 
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block mb-1.5 font-semibold text-[0.9rem] text-[var(--text-dark)]">Email</label>
                            <Input 
                                type="email" 
                                placeholder="Email" 
                                value={newAppointment.email} 
                                onChange={(e) => setNewAppointment({ ...newAppointment, email: e.target.value })} 
                            />
                        </div>
                        <div>
                            <label className="block mb-1.5 font-semibold text-[0.9rem] text-[var(--text-dark)]">Téléphone</label>
                            <Input 
                                placeholder="Téléphone" 
                                value={newAppointment.phone} 
                                onChange={(e) => setNewAppointment({ ...newAppointment, phone: e.target.value })} 
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-1.5 font-semibold text-[0.9rem] text-[var(--text-dark)]">Service</label>
                        <select 
                            className="w-full h-10 border border-[var(--border)] rounded-md px-3 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-sm"
                            value={newAppointment.service} 
                            onChange={(e) => setNewAppointment({ ...newAppointment, service: e.target.value })}
                        >
                            <option value="Consultation générale">Consultation générale</option>
                            <option value="Détartrage">Détartrage</option>
                            <option value="Blanchiment">Blanchiment</option>
                            <option value="Implant dentaire">Implant dentaire</option>
                            <option value="Orthodontie">Orthodontie</option>
                            <option value="Urgence">Urgence</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div>
                            <label className="block mb-1.5 font-semibold text-[0.9rem] text-[var(--text-dark)]">Date</label>
                            <Input 
                                type="date" 
                                value={newAppointment.date} 
                                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })} 
                            />
                        </div>
                        <div>
                            <label className="block mb-1.5 font-semibold text-[0.9rem] text-[var(--text-dark)]">Heure</label>
                            <Input 
                                type="time" 
                                value={newAppointment.time} 
                                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })} 
                            />
                        </div>
                    </div>
                    
                    <Button 
                        className="w-full" 
                        onClick={handleCreateAppointment} 
                        disabled={isUpdating || !newAppointment.firstName || !newAppointment.lastName || !newAppointment.date || !newAppointment.time}
                    >
                        {isUpdating ? 'Création...' : 'Créer le rendez-vous'}
                    </Button>
                </div>
            )}
        </Modal>
    );
};
