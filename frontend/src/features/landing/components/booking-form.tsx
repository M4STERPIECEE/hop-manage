import { useState } from 'react';
import type { BookingFormData } from 'src/shared/model';
import { ArrowLeft, Check } from 'lucide-react';
import { useAppForm } from 'src/shared/form/form-setup';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { Button } from 'src/shared/ui/button';
import { Card, CardTitle, CardContent } from 'src/shared/ui/card';
import { InfoField } from 'src/shared/ui/info-field';

export const BookingForm = () => {
    const [step, setStep] = useState<'form' | 'summary'>('form');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';
    const today = new Date().toISOString().split('T')[0];

    const form = useAppForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            date: '',
            time: '',
            service: '',
        } as BookingFormData,
        // @ts-ignore
        validatorAdapter: zodValidator(),
        onSubmit: async ({ value }) => {
            if (step === 'form') {
                setStep('summary');
                return;
            }

            setError(null);
            try {
                const response = await fetch(`${apiBase}/appointments/public`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(value),
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la réservation');
                }

                setSuccess(true);
                form.reset();
                setTimeout(() => {
                    setSuccess(false);
                    setStep('form');
                }, 5000);
            } catch {
                setError("Impossible de confirmer le rendez-vous. Veuillez réessayer.");
            }
        },
    });

    if (success) {
        return (
            <Card className="p-12 text-center">
                <div className="bg-[var(--success)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold mb-4">Rendez-vous confirmé !</CardTitle>
                <CardContent className="p-0 text-lg mb-8">
                    Votre demande a été enregistrée avec succès. Notre équipe vous contactera sous peu pour confirmer l'horaire précis.
                </CardContent>
                <Button variant="outline" onClick={() => { setSuccess(false); setStep('form'); }}>
                    Retour à l'accueil
                </Button>
            </Card>
        );
    }

    if (step === 'summary') {
        const value = form.state.values;
        return (
            <div className="bg-white rounded-2xl p-10 shadow-[0_10px_30px_rgba(10,77,104,0.15)] text-[var(--text-dark)] animate-[fadeInRight_0.5s_ease-out]">
                <div className="flex items-center mb-8 gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => setStep('form')} 
                        className="p-2 rounded-full hover:bg-[rgba(10,77,104,0.05)] text-[var(--primary)] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h2 className="font-poppins text-[var(--primary)] text-3xl font-bold">
                        Confirmation
                    </h2>
                </div>

                <p className="mb-6 text-[rgba(10,77,104,0.7)] text-sm">
                    Veuillez vérifier vos informations avant la confirmation finale.
                </p>

                <div className="grid grid-cols-1 gap-3 mb-10">
                    <InfoField label="Patient" value={`${value.firstName} ${value.lastName}`} />
                    <InfoField label="Email" value={value.email} />
                    <InfoField label="Téléphone" value={value.phone} />
                    <InfoField label="Date" value={value.date ? new Date(value.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''} />
                    <InfoField label="Heure" value={value.time} />
                    <InfoField label="Service" value={value.service} />
                </div>

                {error && (
                    <p className="text-[var(--danger)] mb-4 text-sm text-center font-medium">
                        {error}
                    </p>
                )}

                <form.Subscribe
                    selector={(state) => [state.isSubmitting]}
                    children={([isSubmitting]) => (
                        <Button 
                            onClick={(e) => {
                                e.preventDefault();
                                form.handleSubmit();
                            }} 
                            disabled={isSubmitting} 
                            className="w-full h-14 text-lg"
                        >
                            <Check className="w-5 h-5 mr-2" /> 
                            {isSubmitting ? 'Confirmation...' : 'Confirmer le rendez-vous'}
                        </Button>
                    )}
                />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-10 shadow-[0_10px_30px_rgba(10,77,104,0.15)] text-[var(--text-dark)] animate-[fadeInUp_0.8s_ease-out_0.3s_backwards]">
            <h2 className="font-poppins text-[var(--primary)] text-3xl font-bold mb-6">
                Réserver un rendez-vous
            </h2>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <form.AppField
                        name="firstName"
                        validators={{ onChange: z.string().min(1, 'Prénom requis') }}
                        children={(field) => <field.InputField label="Prénom" />}
                    />
                    <form.AppField
                        name="lastName"
                        validators={{ onChange: z.string().min(1, 'Nom requis') }}
                        children={(field) => <field.InputField label="Nom" />}
                    />
                </div>

                <div className="mb-4">
                    <form.AppField
                        name="email"
                        validators={{ onChange: z.string().email('Email invalide').min(1, 'Email requis') }}
                        children={(field) => <field.InputField label="Email" type="email" />}
                    />
                </div>

                <div className="mb-4">
                    <form.AppField
                        name="phone"
                        validators={{ onChange: z.string().min(1, 'Téléphone requis') }}
                        children={(field) => <field.InputField label="Téléphone" type="tel" />}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <form.AppField
                        name="date"
                        validators={{ onChange: z.string().min(1, 'Date requise') }}
                        children={(field) => <field.InputField label="Date" type="date" min={today} />}
                    />
                    <form.AppField
                        name="time"
                        validators={{ onChange: z.string().min(1, 'Heure requise') }}
                        children={(field) => <field.InputField label="Heure" type="time" />}
                    />
                </div>

                <div className="mb-6">
                    <form.AppField
                        name="service"
                        validators={{ onChange: z.string().min(1, 'Service requis') }}
                        children={(field: any) => (
                            <field.SelectField
                                label="Type de soin" 
                                options={[
                                    { label: 'Sélectionnez un service', value: '' },
                                    { label: 'Consultation generale', value: 'Consultation generale' },
                                    { label: 'Detartrage', value: 'Detartrage' },
                                    { label: 'Blanchiment', value: 'Blanchiment' },
                                    { label: 'Implant dentaire', value: 'Implant dentaire' },
                                    { label: 'Orthodontie', value: 'Orthodontie' },
                                    { label: 'Urgence', value: 'Urgence' },
                                ]}
                            />
                        )}
                    />
                </div>
                
                <form.Subscribe
                    selector={(state) => [state.canSubmit]}
                    children={([canSubmit]) => (
                        <Button type="submit" disabled={!canSubmit} className="w-full h-12 text-lg">
                            Continuer
                        </Button>
                    )}
                />
            </form>
        </div>
    );
};

