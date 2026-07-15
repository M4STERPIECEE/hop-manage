import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../api/auth-service';

export const ProtectedRoute = () => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
