import { Link as RouterLink } from 'react-router-dom';
import { Smile } from 'lucide-react';
import { Button } from '../../shared/ui';

interface HeaderProps {
    onAdminClick?: () => void;
}

export const Header = ({ onAdminClick }: HeaderProps) => {
    return (
        <header className="bg-[var(--bg-white)] shadow-sm sticky top-0 z-[100] animate-[slideDown_0.6s_ease-out]">
            <div className="max-w-[1400px] mx-auto px-8 py-5 flex justify-between items-center">
                <div className="flex items-center gap-2 font-poppins text-3xl font-bold text-[var(--primary)]">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-lg flex items-center justify-center text-white">
                        <Smile className="w-6 h-6" />
                    </div>
                    DentiCare
                </div>

                <ul className="hidden md:flex gap-8 list-none m-0 p-0">
                    <li>
                        <a href="#services" className="text-[var(--text-gray)] no-underline font-medium transition-colors duration-300 hover:text-[var(--primary)]">
                            Services
                        </a>
                    </li>
                    <li>
                        <a href="#about" className="text-[var(--text-gray)] no-underline font-medium transition-colors duration-300 hover:text-[var(--primary)]">
                            À propos
                        </a>
                    </li>
                    <li>
                        <a href="#contact" className="text-[var(--text-gray)] no-underline font-medium transition-colors duration-300 hover:text-[var(--primary)]">
                            Contact
                        </a>
                    </li>
                </ul>

                <RouterLink to="/login" onClick={onAdminClick}>
                    <Button>
                        Espace Admin
                    </Button>
                </RouterLink>
            </div>
        </header>
    );
};