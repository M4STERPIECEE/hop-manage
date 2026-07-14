export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
    services: `${API_BASE_URL}/api/v1/services`,
    appointments: `${API_BASE_URL}/api/v1/appointments`,
    patients: `${API_BASE_URL}/api/v1/patients`,
} as const;
