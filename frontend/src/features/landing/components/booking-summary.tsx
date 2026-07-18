import { useState } from 'react';
import { ArrowLeft, User, Calendar, ShieldCheck } from 'lucide-react';
import type { BookingFormData } from 'src/shared/model';
import { Button } from 'src/shared/ui/button';
import { Checkbox } from 'src/shared/ui/checkbox';
import { Spinner } from 'src/shared/ui/spinner';
import { toaster } from 'src/shared/ui/toaster';
import { useEffect } from 'react';

interface BookingSummaryProps {
    values: BookingFormData;
    error: string | null;
    isSubmitting: boolean;
    onBack: () => void;
    onConfirm: () => void;
}

const InfoRow = ({ label, value, className = "break-words" }: { label: string; value: React.ReactNode; className?: string }) => (
    <div className="flex items-start gap-3 w-full">
        <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 mb-0.5 uppercase tracking-wide font-medium">{label}</p>
            <p className={`text-sm font-semibold text-slate-900 ${className}`}>{value}</p>
        </div>
    </div>
);

export const BookingSummary = ({ values, error, isSubmitting, onBack, onConfirm }: BookingSummaryProps) => {
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (error) {
            toaster.create({
                title: 'Erreur',
                description: error,
                type: 'error'
            });
        }
    }, [error]);

    return (
        <div key="summary" className="flex flex-col h-full">
            <div className="flex items-center mb-8 gap-4">
                <Button variant="ghost" onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100 text-[var(--primary)] transition-all duration-300 shrink-0">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="font-poppins text-[var(--primary)] text-3xl font-bold truncate">
                    Confirmation
                </h2>
            </div>

            <p className="mb-6 text-slate-500 text-sm">
                Veuillez vérifier vos informations avant la confirmation finale.
            </p>
            <div className="content-confirm grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col gap-5 transition-all hover:shadow-md hover:border-slate-300 overflow-hidden">
                    <div className="flex items-center gap-3 mb-1 pb-3 border-b border-slate-200">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-slate-800 truncate">Détails du patient</h3>
                    </div>

                    <InfoRow label="Nom complet" value={`${values.firstName} ${values.lastName}`} />
                    <InfoRow label="Adresse Email" value={values.email} className="break-all" />
                    <InfoRow label="Téléphone" value={values.phone} />
                </div>
                <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col gap-5 transition-all hover:shadow-md hover:border-slate-300 overflow-hidden">
                    <div className="flex items-center gap-3 mb-1 pb-3 border-b border-slate-200">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4 text-emerald-600" />
                        </div>
                        <h3 className="font-semibold text-slate-800 truncate">Détails du rendez-vous</h3>
                    </div>
                    <InfoRow label="Date prévue" value={values.date ? new Date(values.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''} className="capitalize break-words" />
                    <InfoRow label="Heure" value={values.time} />
                    <InfoRow label="Service demandé" value={values.service} />
                </div>

            </div>
            <div className="mb-6 mt- flex justify-left">
                <label className="flex items-center gap-3 px-5 py-3 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer select-none transition-all duration-300 hover:border-slate-300 hover:bg-slate-100/50 has-[[data-state=checked]]:border-emerald-300 has-[[data-state=checked]]:bg-emerald-50/50">
                    <Checkbox checked={isVerified} onCheckedChange={(c) => setIsVerified(c === true)} />
                    <ShieldCheck className={`w-5 h-5 ${isVerified ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-sm font-medium text-slate-700">Je ne suis pas un robot</span>
                </label>
            </div>

            <div className="mt-auto flex justify-center">
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        onConfirm();
                    }}
                    disabled={isSubmitting || !isVerified}
                    className="w-fit px-8 h-12 text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                >
                    {isSubmitting ? <Spinner className="size-5 mr-2" /> : 'Confirmer le rendez-vous'}
                </Button>
            </div>
        </div>
    );
};