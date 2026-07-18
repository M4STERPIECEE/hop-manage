import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';

interface DashboardLayoutProps {
    title: string;
}

export const DashboardLayout = ({ title }: DashboardLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex min-h-screen bg-[var(--bg-light)] page-transition">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 ml-0 lg:ml-[180px]">
                <TopBar title={title} onMenuToggle={toggleSidebar} />
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};