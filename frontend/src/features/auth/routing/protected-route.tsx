import { Navigate, Outlet } from '@tanstack/react-router';
import { authService } from '../api/auth-service';

export const ProtectedRoute = () => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
