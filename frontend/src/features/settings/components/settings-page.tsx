import { Button } from 'src/shared/ui/button';
import { Input } from 'src/shared/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from 'src/shared/ui/card';
import { Label } from 'src/shared/ui/label';

export const SettingsPage = () => {
    return (
        <Card>
            <CardHeader className="border-b pb-6">
                <CardTitle className="font-poppins text-2xl">
                    Paramètres du cabinet
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <div className="mb-6">
                    <Label htmlFor="cabinet-name">Nom du cabinet</Label>
                    <Input 
                        id="cabinet-name"
                        type="text" 
                        defaultValue="DentiCare" 
                        className="w-full"
                    />
                </div>

                <div className="mb-6">
                    <Label htmlFor="address">Adresse</Label>
                    <Input 
                        id="address"
                        type="text" 
                        defaultValue="123 Avenue de la Santé, Paris" 
                        className="w-full"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input 
                            id="phone"
                            type="tel" 
                            defaultValue="01 23 45 67 89" 
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email"
                            type="email" 
                            defaultValue="contact@denticare.fr" 
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <Label htmlFor="opening-time">Heure d'ouverture</Label>
                        <Input 
                            id="opening-time"
                            type="time" 
                            defaultValue="08:00" 
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Label htmlFor="closing-time">Heure de fermeture</Label>
                        <Input 
                            id="closing-time"
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
            </CardContent>
        </Card>
    );
};