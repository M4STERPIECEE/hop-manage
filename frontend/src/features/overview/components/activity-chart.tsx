import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Lun', rendezVous: 8, patients: 5 },
    { name: 'Mar', rendezVous: 12, patients: 8 },
    { name: 'Mer', rendezVous: 7, patients: 4 },
    { name: 'Jeu', rendezVous: 15, patients: 10 },
    { name: 'Ven', rendezVous: 10, patients: 7 },
    { name: 'Sam', rendezVous: 4, patients: 3 },
    { name: 'Dim', rendezVous: 0, patients: 0 },
];

export const ActivityChart = () => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(10,77,104,0.08)] border border-[rgba(10,77,104,0.08)] h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="font-poppins text-2xl text-[var(--primary)] mb-1 font-bold">
                        Activité hebdomadaire
                    </h2>
                    <p className="text-[0.85rem] text-[rgba(10,77,104,0.6)] font-medium">
                        Nombre de rendez-vous et nouveaux patients cette semaine
                    </p>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 40, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRdVs" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(10, 77, 104, 0.05)" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'rgba(10, 77, 104, 0.5)', fontSize: 12 }} 
                            dy={10} 
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'rgba(10, 77, 104, 0.5)', fontSize: 12 }} 
                        />
                        <Tooltip 
                            contentStyle={{ 
                                borderRadius: '8px', 
                                border: 'none', 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                                fontSize: '12px' 
                            }} 
                        />
                        <Area 
                            type="monotone" 
                            dataKey="rendezVous" 
                            stroke="var(--primary)" 
                            fillOpacity={1} 
                            fill="url(#colorRdVs)" 
                            strokeWidth={3} 
                            name="Rendez-vous" 
                        />
                        <Area 
                            type="monotone" 
                            dataKey="patients" 
                            stroke="var(--accent)" 
                            fillOpacity={1} 
                            fill="url(#colorPatients)" 
                            strokeWidth={3} 
                            name="Nouveaux Patients" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};