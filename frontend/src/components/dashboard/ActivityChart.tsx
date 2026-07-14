import { Box, Heading, Text, Flex } from '@chakra-ui/react';
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
        <Box
            bg="white"
            borderRadius="12px"
            p="1.5rem"
            boxShadow="0 2px 12px rgba(10, 77, 104, 0.08)"
            border="1px solid rgba(10, 77, 104, 0.08)"
            h="400px"
        >
            <Flex justify="space-between" align="center" mb="2rem">
                <Box>
                    <Heading
                        as="h2"
                        fontFamily="'Crimson Pro', serif"
                        fontSize="1.5rem"
                        color="primary" 
                        mb="0.25rem"
                        fontWeight="700"
                    >
                        Activité hebdomadaire
                    </Heading>
                    <Text 
                        fontSize="0.85rem" 
                        color="rgba(10, 77, 104, 0.6)"
                        fontWeight="500"
                    >
                        Nombre de rendez-vous et nouveaux patients cette semaine
                    </Text>
                </Box>
            </Flex>

            <Box h="300px" w="100%">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 40, left: 0, bottom: 40 }}
                    >
                        <defs>
                            <linearGradient id="colorRdVs" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
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
            </Box>
        </Box>
    );
};
