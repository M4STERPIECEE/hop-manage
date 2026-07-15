import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { ProtectedRoute } from '../features/auth/routing/protected-route';
import { LandingPage } from '../features/landing/components/landing-page';
import { DashboardLayout } from '../app/layout/dashboard-layout';
import { OverviewPage } from '../features/overview/components/overview-page';
import { AppointmentsPage } from '../features/appointments/components/appointments-page';
import { PatientsPage } from '../features/patients/components/patients-page';
import { CalendarPage } from '../features/calendar/components/calendar-page';
import { ServicesPage } from '../features/services/components/services-page';
import { SettingsPage } from '../features/settings/components/settings-page';
import { LoginPage } from '../features/auth/components/login-page';
import { ResetPasswordPage } from '../features/auth/components/reset-password-page';
import { Toaster } from '../shared/ui/toaster';

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
