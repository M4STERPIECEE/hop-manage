import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Calendar, Users, Grid, ClipboardList, Settings, Smile } from 'lucide-react';
import { cn } from '../../shared/lib/utils';

interface NavItem {
    path: string;
    icon: typeof BarChart3;
    label: string;
}

const navItems: NavItem[] = [
    { path: '/dashboard', icon: BarChart3, label: "Vue d'ensemble" },
    { path: '/dashboard/appointments', icon: ClipboardList, label: 'Rendez-vous' },
    { path: '/dashboard/patients', icon: Users, label: 'Patients' },
    { path: '/dashboard/calendar', icon: Calendar, label: 'Calendrier' },
    { path: '/dashboard/services', icon: Grid, label: 'Services' },
    { path: '/dashboard/settings', icon: Settings, label: 'Paramètres' },
];

interface SidebarProps {
    isOpen?: boolean;
}

export const Sidebar = ({ isOpen = true }: SidebarProps) => {
    const location = useLocation();

    return (
        <aside 
            className={cn(
                "w-[280px] bg-[var(--primary)] text-white py-8 fixed h-screen overflow-y-auto transition-transform duration-300 z-[1000]",
                isOpen ? "translate-x-0" : "-translate-x-full",
                "lg:translate-x-0"
            )}
        >
            <div className="px-6 mb-8">
                <div className="flex items-center gap-2 font-poppins text-2xl font-bold">
                    <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-lg flex items-center justify-center text-2xl">
                        <Smile className="w-6 h-6" />
                    </div>
                    DentiCare
                </div>
            </div>

            <nav>
                <ul className="list-none">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path} className="mb-2">
                                <Link 
                                    to={item.path} 
                                    className={cn(
                                        "flex items-center gap-4 py-4 px-6 no-underline transition-all duration-300 border-l-4",
                                        isActive 
                                            ? "text-white bg-white/10 border-[var(--accent)]" 
                                            : "text-white/80 border-transparent hover:bg-white/10 hover:text-white hover:border-[var(--accent)]"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};