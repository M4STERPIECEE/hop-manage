import { Input, Button } from '../../../../shared/ui';
import { Modal } from '../../../../shared/ui/modal';

interface EditForm {
    durationMinutes: string;
    price: string;
    status: string;
}

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    editForm: EditForm;
    setEditForm: React.Dispatch<React.SetStateAction<EditForm>>;
    handleUpdateService: () => void;
    isUpdating: boolean;
}

export const ServiceModal = ({
    isOpen,
    onClose,
    editForm,
    setEditForm,
    handleUpdateService,
    isUpdating
}: ServiceModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Modifier le service">
            <div className="flex flex-col gap-5">
                <div>
                    <label className="block mb-2 font-semibold text-[var(--primary)] text-[0.9rem]">Durée (minutes)</label>
                    <Input 
                        type="number" 
                        value={editForm.durationMinutes} 
                        onChange={(e) => setEditForm(prev => ({ ...prev, durationMinutes: e.target.value }))} 
                        placeholder="Ex: 45" 
                    />
                </div>
                <div>
                    <label className="block mb-2 font-semibold text-[var(--primary)] text-[0.9rem]">Prix (MGA)</label>
                    <Input 
                        type="number" 
                        value={editForm.price} 
                        onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))} 
                        placeholder="Ex: 80000" 
                    />
                </div>
                <div>
                    <label className="block mb-2 font-semibold text-[var(--primary)] text-[0.9rem]">Statut</label>
                    <select 
                        className="w-full h-12 px-4 text-base border-2 border-[rgba(10,77,104,0.2)] rounded-lg bg-white outline-none cursor-pointer focus:border-[var(--accent)] focus:shadow-[0_0_0_1px_var(--accent)]"
                        value={editForm.status} 
                        onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                    >
                        <option value="Actif">Actif</option>
                        <option value="Inactif">Inactif</option>
                    </select>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="outline" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button onClick={handleUpdateService} disabled={isUpdating}>
                        {isUpdating ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
