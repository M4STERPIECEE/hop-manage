import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/landing/LandingPage';
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { OverviewPage } from './pages/overview/OverviewPage';
import { AppointmentsPage } from './pages/appointments/AppointmentsPage';
import { PatientsPage } from './pages/patients/PatientsPage';
import { CalendarPage } from './pages/calendar/CalendarPage';
import { ServicesPage } from './pages/services/ServicesPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { LoginPage } from './pages/login/LoginPage';
import { ResetPasswordPage } from './pages/resetpassword/ResetPasswordPage';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Routes Protégées */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout title="Vue d'ensemble" />}>
            <Route index element={<OverviewPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Box>
  );
}

export default App;
