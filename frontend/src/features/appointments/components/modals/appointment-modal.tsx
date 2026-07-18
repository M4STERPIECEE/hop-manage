import { Badge } from 'src/shared/ui/badge';
import { Button } from 'src/shared/ui/button';
import { Input } from 'src/shared/ui/input';
import { Label } from 'src/shared/ui/label';
import { Modal } from 'src/shared/ui/modal';
import type { Appointment } from '../../../../shared/model';

const statusVariant: Record<string, 'warning' | 'success' | 'neutral' | 'destructive'> = {
  PENDING: 'warning',
  'En attente': 'warning',
  CONFIRMED: 'success',
  Confirmé: 'success',
  COMPLETED: 'neutral',
  Terminé: 'neutral',
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
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input 
                                id="firstName"
                                placeholder="Prénom" 
                                value={newAppointment.firstName} 
                                onChange={(e) => setNewAppointment({ ...newAppointment, firstName: e.target.value })} 
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Nom</Label>
                            <Input 
                                id="lastName"
                                placeholder="Nom" 
                                value={newAppointment.lastName} 
                                onChange={(e) => setNewAppointment({ ...newAppointment, lastName: e.target.value })} 
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email"
                                type="email" 
                                placeholder="Email" 
                                value={newAppointment.email} 
                                onChange={(e) => setNewAppointment({ ...newAppointment, email: e.target.value })} 
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Téléphone</Label>
                            <Input 
                                id="phone"
                                placeholder="Téléphone" 
                                value={newAppointment.phone} 
                                onChange={(e) => setNewAppointment({ ...newAppointment, phone: e.target.value })} 
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <Label htmlFor="service">Service</Label>
                        <select 
                            id="service"
                            className="flex h-10 w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
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
                            <Label htmlFor="date">Date</Label>
                            <Input 
                                id="date"
                                type="date" 
                                value={newAppointment.date} 
                                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })} 
                            />
                        </div>
                        <div>
                            <Label htmlFor="time">Heure</Label>
                            <Input 
                                id="time"
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
