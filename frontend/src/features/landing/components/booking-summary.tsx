import { ArrowLeft, Check } from 'lucide-react';
import type { BookingFormData } from 'src/shared/model';
import { Button } from 'src/shared/ui/button';
import { InfoField } from 'src/shared/ui/info-field';

interface BookingSummaryProps {
    values: BookingFormData;
    error: string | null;
    isSubmitting: boolean;
    onBack: () => void;
    onConfirm: () => void;
}

export const BookingSummary = ({ values, error, isSubmitting, onBack, onConfirm }: BookingSummaryProps) => {
    return (
        <div key="summary" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-[var(--text-dark)] animate-[fadeInUp_0.4s_ease-out] max-w-2xl mx-auto">
            <div className="flex items-center mb-8 gap-4">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-muted text-[var(--primary)] transition-all duration-300"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="font-poppins text-[var(--primary)] text-3xl font-bold">
                    Confirmation
                </h2>
            </div>

            <p className="mb-6 text-[var(--text-gray)] text-sm">
                Veuillez vérifier vos informations avant la confirmation finale.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <InfoField label="Patient" value={`${values.firstName} ${values.lastName}`} />
                <InfoField label="Email" value={values.email} />
                <InfoField label="Téléphone" value={values.phone} />
                <InfoField label="Date" value={values.date ? new Date(values.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''} />
                <InfoField label="Heure" value={values.time} />
                <InfoField label="Service" value={values.service} />
            </div>

            {error && (
                <p className="text-[var(--danger)] mb-4 text-sm text-center font-medium">
                    {error}
                </p>
            )}

            <Button
                onClick={(e) => {
                    e.preventDefault();
                    onConfirm();
                }}
                disabled={isSubmitting}
                className="w-full h-14 text-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            >
                <Check className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Confirmation...' : 'Confirmer le rendez-vous'}
            </Button>
        </div>
    );
};
