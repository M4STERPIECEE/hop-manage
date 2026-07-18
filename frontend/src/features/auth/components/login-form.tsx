import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Mail, Lock } from 'lucide-react';
import { authService } from '../api/auth-service';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { Button } from 'src/shared/ui/button';
import { Input } from 'src/shared/ui/input';
import { Alert } from 'src/shared/ui/alert';
import { useFormatError } from 'src/shared/lib/use-format-error';
import { Spinner } from 'src/shared/ui/spinner';

export const LoginForm = () => {
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [isForgotPasswordSubmitting, setIsForgotPasswordSubmitting] = useState(false);
    const formatError = useFormatError();
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        // @ts-ignore
        validatorAdapter: zodValidator(),
        onSubmit: async ({ value }) => {
            setError(null);
            setInfo(null);

            try {
                await authService.login(value);
                navigate({ to: '/dashboard', replace: true });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Identifiants invalides.');
            }
        },
    });

    const handleForgotPassword = async (email: string) => {
        setError(null);
        setInfo(null);

        if (!email) {
            setError('Veuillez saisir votre email.');
            return;
        }

        setIsForgotPasswordSubmitting(true);

        try {
            await authService.requestPasswordReset(email);
            setInfo('Demande envoyée. Vérifiez votre email.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur de réinitialisation.');
        } finally {
            setIsForgotPasswordSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-[var(--text-dark)] animate-[fadeInUp_0.6s_ease-out_0.2s_backwards] w-[65%] max-w-4xl mx-auto">
            <h2 className="font-poppins text-[var(--text-dark)] text-3xl font-bold mb-2">
                Connexion
            </h2>

            <p className="text-[var(--text-gray)] mb-8">
                Accédez au tableau de bord sécurisé.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}>
                <form.Field name="email" validators={{ onChange: z.string().email('Email invalide').min(1, 'Email requis') }} children={(field) => (
                    <div className="mb-6">
                        <label className="block text-[var(--text-dark)] font-medium mb-2 text-sm tracking-wide">
                            Email
                        </label>

                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-gray)] pointer-events-none z-10">
                                <Mail className="w-4 h-4" />
                            </div>

                            <div className="absolute left-10 top-1/2 -translate-y-1/2 h-5 w-px bg-gray-300 pointer-events-none z-10" />

                            <Input type="email" name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="votre@email.com" className="w-full pl-14 text-sm" />
                        </div>

                        {field.state.meta.errors ? (
                            <p className="text-xs text-[var(--danger)] mt-1">
                                {formatError(field.state.meta.errors)}
                            </p>
                        ) : null}
                    </div>
                )} />

                <form.Field name="password" validators={{ onChange: z.string().min(1, 'Mot de passe requis') }} children={(field) => (
                    <div className="mb-6">
                        <label className="block text-[var(--text-dark)] font-medium mb-2 text-sm tracking-wide">
                            Mot de passe
                        </label>

                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-gray)] pointer-events-none z-10">
                                <Lock className="w-4 h-4" />
                            </div>

                            <div className="absolute left-10 top-1/2 -translate-y-1/2 h-5 w-px bg-gray-300 pointer-events-none z-10" />

                            <Input type="password" name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="••••••••" className="w-full pl-14 text-sm" />
                        </div>

                        {field.state.meta.errors ? (
                            <p className="text-xs text-[var(--danger)] mt-1">
                                {formatError(field.state.meta.errors)}
                            </p>
                        ) : null}
                    </div>
                )} />

                <div className="flex justify-end mb-8 relative z-10">
                    <a href="#" onClick={(e) => { e.preventDefault(); handleForgotPassword(form.state.values.email); }} className="relative z-10 cursor-pointer text-sm text-[var(--text-gray)] font-medium hover:text-[var(--primary)] hover:underline decoration-1 underline-offset-2 inline-block">
                        {isForgotPasswordSubmitting ? 'Envoi...' : 'Mot de passe oublié ?'}
                    </a>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        {error}
                    </Alert>
                )}

                {info && (
                    <Alert className="mb-6">
                        {info}
                    </Alert>
                )}

                <form.Subscribe selector={(state) => [state.isSubmitting]} children={([isSubmitting]) => (
                    <div className="flex justify-center relative z-10">
                        <Button type="submit" disabled={isSubmitting} className="w-fit px-10 h-12 text-lg rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:brightness-110 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed">
                            {isSubmitting ? (
                                <>
                                    <Spinner className="size-5" />
                                    Connexion...
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </Button>
                    </div>
                )} />
            </form>
        </div>
    );
};