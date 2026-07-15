import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { authService } from '../api/auth-service';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
export const LoginForm = () => {
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [isForgotPasswordSubmitting, setIsForgotPasswordSubmitting] = useState(false);
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
                navigate('/dashboard', { replace: true });
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
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/20 text-white transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
            <h2 className="font-poppins text-white text-3xl font-bold mb-2">
                Login administrateur
            </h2>
            <p className="text-white/80 mb-8">
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
                            <label className="block text-white font-medium mb-2 text-sm tracking-wide">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none z-10">
                                    <Mail className="w-[18px] h-[18px]" />
                                </div>
                                <input
                                    type="email"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="votre@email.com"
                                    className="w-full h-14 pl-12 bg-white/5 border border-white/10 rounded-xl text-base text-white placeholder:text-white/40 transition-all duration-300 hover:bg-white/10 focus:outline-none focus:border-white/50 focus:bg-white/10 focus:ring-[3px] focus:ring-white/10"
                                />
                            </div>
                            {field.state.meta.errors ? (
                                <p className="text-xs text-[#ff8a8a] mt-1">{field.state.meta.errors.join(', ')}</p>
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
                            <label className="block text-white font-medium mb-2 text-sm tracking-wide">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none z-10">
                                    <Lock className="w-[18px] h-[18px]" />
                                </div>
                                <input
                                    type="password"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full h-14 pl-12 bg-white/5 border border-white/10 rounded-xl text-base text-white placeholder:text-white/40 transition-all duration-300 hover:bg-white/10 focus:outline-none focus:border-white/50 focus:bg-white/10 focus:ring-[3px] focus:ring-white/10"
                                />
                            </div>
                            {field.state.meta.errors ? (
                                <p className="text-xs text-[#ff8a8a] mt-1">{field.state.meta.errors.join(', ')}</p>
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
                        className="text-sm text-white/80 font-medium hover:text-white hover:underline transition-colors"
                    >
                        {isForgotPasswordSubmitting ? 'Envoi...' : 'Mot de passe oublié ?'}
                    </a>
                </div>

                {error && (
                    <div className="mb-6 p-3.5 rounded-xl bg-red-600/20 backdrop-blur-md border border-red-600/30 text-[#ff8a8a] text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                {info && (
                    <div className="mb-6 p-3.5 rounded-xl bg-[#05c7e2]/20 backdrop-blur-md border border-[#05c7e2]/30 text-[#8ee2f1] text-sm font-medium text-center">
                        {info}
                    </div>
                )}

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <button
                            type="submit"
                            disabled={!canSubmit || isSubmitting}
                            className="w-full h-14 bg-white text-[var(--primary)] rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Connexion...' : 'Se connecter'}
                        </button>
                    )}
                />
            </form>
        </div>
    );
};