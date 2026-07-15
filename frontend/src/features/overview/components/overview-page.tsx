import { Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import { StatCard } from './stat-card';
import { ActivityChart } from './activity-chart';

export const OverviewPage = () => {

    const today = new Date();
    const greeting =
        today.getHours() < 12
            ? 'Bonjour'
            : today.getHours() < 18
                ? 'Bon après-midi'
                : 'Bonsoir';

    return (
        <div>
            <div className="mb-8 p-6 bg-gradient-to-br from-[rgba(10,77,104,0.05)] to-[rgba(5,199,226,0.05)] rounded-xl border border-[rgba(10,77,104,0.1)]">
                <h1 className="font-poppins text-3xl text-[var(--primary)] mb-2 font-bold">
                    {greeting}, Dr. Martin 👋
                </h1>
                <p className="text-[0.95rem] text-[rgba(10,77,104,0.7)] font-medium">
                    Voici un aperçu de votre activité aujourd'hui
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard title="Rendez-vous aujourd'hui" value="12" icon={<Calendar />} change="+3 depuis hier" variant="primary" />
                <StatCard title="Patients actifs" value="342" icon={<Users />} change="+15 ce mois" variant="accent" />
                <StatCard title="Taux de présence" value="94%" icon={<CheckCircle />} change="+2% ce mois" variant="success" />
                <StatCard title="En attente" value="8" icon={<Clock />} change="Confirmations requises" variant="warning" />
            </div>
            <ActivityChart />
        </div>
    );
};