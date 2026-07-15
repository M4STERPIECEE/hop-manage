import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { ConfirmModal, Button } from '../../shared/ui';
import { authService } from '../../features/auth/api/auth-service';
import { Menu } from 'lucide-react';

interface TopBarProps {
    title: string;
    onMenuToggle?: () => void;
}

export const TopBar = ({ title, onMenuToggle }: TopBarProps) => {
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = async () => {
        try {
            await authService.logout();
            setIsLogoutModalOpen(false);
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            setIsLogoutModalOpen(false);
            navigate('/', { replace: true });
        }
    };

    const handleCancelLogout = () => {
        setIsLogoutModalOpen(false);
    };

    return (
        <>
            <div className="bg-[var(--bg-white)] px-8 py-6 shadow-sm flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="default"
                        onClick={onMenuToggle} 
                        className="block lg:hidden p-2 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                    <h1 className="font-poppins text-3xl text-[var(--primary)] font-bold">
                        {title}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-full flex items-center justify-center text-white font-semibold">
                        Dr
                    </div>
                    <div className="hidden md:block font-medium">Dr. Martin</div>
                    <Button variant="danger" onClick={handleLogoutClick}>
                        Déconnexion
                    </Button>
                </div>
            </div>
            <ConfirmModal 
                isOpen={isLogoutModalOpen} 
                onConfirm={handleConfirmLogout} 
                onCancel={handleCancelLogout} 
                title="Confirmation de déconnexion" 
                message="Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte." 
                confirmText="Se déconnecter" 
                cancelText="Annuler" 
            />
        </>
    );
};