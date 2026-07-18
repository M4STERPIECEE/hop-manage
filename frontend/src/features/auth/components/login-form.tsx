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

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
                <form.Field
                    name="email"
                    validators={{
                        onChange: z.string().email('Email invalide').min(1, 'Email requis'),
                    }}
                    children={(field) => (
                        <div className="mb-6">
                            <label className="block text-[var(--text-dark)] font-medium mb-2 text-sm tracking-wide">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] pointer-events-none z-10">
                                    <Mail className="w-[18px] h-[18px]" />
                                </div>
                                <Input
                                    type="email"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="votre@email.com"
                                    className="w-full h-12 pl-12 rounded-xl text-base transition-all duration-300"
                                />
                            </div>
                            {field.state.meta.errors ? (
                                <p className="text-xs text-[var(--danger)] mt-1">{formatError(field.state.meta.errors)}</p>
                            ) : null}
                        </div>
                    )}
                />

                <form.Field
                    name="password"
                    validators={{
                        onChange: z.string().min(1, 'Mot de passe requis'),
                    }}
                    children={(field) => (
                        <div className="mb-6">
                            <label className="block text-[var(--text-dark)] font-medium mb-2 text-sm tracking-wide">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] pointer-events-none z-10">
                                    <Lock className="w-[18px] h-[18px]" />
                                </div>
                                <Input
                                    type="password"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full h-12 pl-12 rounded-xl text-base transition-all duration-300"
                                />
                            </div>
                            {field.state.meta.errors ? (
                                <p className="text-xs text-[var(--danger)] mt-1">{formatError(field.state.meta.errors)}</p>
                            ) : null}
                        </div>
                    )}
                />

                <div className="flex justify-end mb-8">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleForgotPassword(form.getFieldValue('email'));
                        }}
                        className="text-sm text-[var(--text-gray)] font-medium hover:text-[var(--primary)] hover:underline transition-colors"
                    >
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

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button
                            type="submit"
                            disabled={!canSubmit || isSubmitting}
                            className="w-full h-12 text-lg rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    )}
                />
            </form>
        </div>
    );
};