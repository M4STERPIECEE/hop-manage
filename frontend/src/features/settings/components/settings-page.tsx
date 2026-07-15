import { Button, Input } from '../../../shared/ui';

export const SettingsPage = () => {
    return (
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(10,77,104,0.08)] overflow-hidden">
            <div className="px-8 py-6 border-b-2 border-[var(--border)]">
                <h2 className="font-poppins text-2xl text-[var(--primary)] font-bold">
                    Paramètres du cabinet
                </h2>
            </div>

            <div className="p-8">
                <div className="mb-6">
                    <label className="block text-[var(--text-dark)] font-semibold mb-2">
                        Nom du cabinet
                    </label>
                    <Input 
                        type="text" 
                        defaultValue="DentiCare" 
                        className="w-full"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-[var(--text-dark)] font-semibold mb-2">
                        Adresse
                    </label>
                    <Input 
                        type="text" 
                        defaultValue="123 Avenue de la Santé, Paris" 
                        className="w-full"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-[var(--text-dark)] font-semibold mb-2">
                            Téléphone
                        </label>
                        <Input 
                            type="tel" 
                            defaultValue="01 23 45 67 89" 
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-[var(--text-dark)] font-semibold mb-2">
                            Email
                        </label>
                        <Input 
                            type="email" 
                            defaultValue="contact@denticare.fr" 
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-[var(--text-dark)] font-semibold mb-2">
                            Heure d'ouverture
                        </label>
                        <Input 
                            type="time" 
                            defaultValue="08:00" 
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-[var(--text-dark)] font-semibold mb-2">
                            Heure de fermeture
                        </label>
                        <Input 
                            type="time" 
                            defaultValue="18:00" 
                            className="w-full"
                        />
                    </div>
                </div>

                <Button 
                    variant="default"
                    className="w-full py-4 text-lg font-semibold"
                >
                    Enregistrer les modifications
                </Button>
            </div>
        </div>
    );
};