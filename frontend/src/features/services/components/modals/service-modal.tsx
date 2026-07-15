import { Input } from 'src/shared/ui/input';
import { Button } from 'src/shared/ui/button';
import { Label } from 'src/shared/ui/label';
import { Modal } from 'src/shared/ui/modal';

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
                    <Label htmlFor="durationMinutes">Durée (minutes)</Label>
                    <Input 
                        id="durationMinutes"
                        type="number" 
                        value={editForm.durationMinutes} 
                        onChange={(e) => setEditForm(prev => ({ ...prev, durationMinutes: e.target.value }))} 
                        placeholder="Ex: 45" 
                    />
                </div>
                <div>
                    <Label htmlFor="price">Prix (MGA)</Label>
                    <Input 
                        id="price"
                        type="number" 
                        value={editForm.price} 
                        onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))} 
                        placeholder="Ex: 80000" 
                    />
                </div>
                <div>
                    <Label htmlFor="status">Statut</Label>
                    <select 
                        id="status"
                        className="flex h-10 w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
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
