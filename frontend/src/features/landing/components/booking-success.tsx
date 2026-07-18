import { Check } from 'lucide-react';
import { Button } from 'src/shared/ui/button';
import { Card, CardTitle, CardContent } from 'src/shared/ui/card';

interface BookingSuccessProps {
    onBack: () => void;
}

export const BookingSuccess = ({ onBack }: BookingSuccessProps) => {
    return (
        <Card className="p-12 text-center max-w-2xl mx-auto animate-[fadeInUp_0.5s_ease-out]">
            <div className="bg-[var(--success)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold mb-4">Rendez-vous confirmé !</CardTitle>
            <CardContent className="p-0 text-lg mb-8">
                Votre demande a été enregistrée avec succès. Notre équipe vous contactera sous peu pour confirmer l'horaire précis.
            </CardContent>
            <Button variant="outline" onClick={onBack}>
                Retour à l'accueil
            </Button>
        </Card>
    );
};
