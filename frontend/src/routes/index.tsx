import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  Outlet,
} from '@tanstack/react-router';
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

const rootRoute = createRootRoute({
  component: () => (
    <div>
      <Outlet />
      <Toaster />
    </div>
  ),
  notFoundComponent: () => <Navigate to="/" />,
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: ResetPasswordPage,
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: ProtectedRoute,
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/dashboard',
  component: () => <DashboardLayout title="Vue d'ensemble" />,
});

const overviewRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/',
  component: OverviewPage,
});

const appointmentsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/appointments',
  component: AppointmentsPage,
});

const patientsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/patients',
  component: PatientsPage,
});

const calendarRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/calendar',
  component: CalendarPage,
});

const servicesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/services',
  component: ServicesPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/settings',
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  resetPasswordRoute,
  protectedRoute.addChildren([
    dashboardRoute.addChildren([
      overviewRoute,
      appointmentsRoute,
      patientsRoute,
      calendarRoute,
      servicesRoute,
      settingsRoute,
    ]),
  ]),
]);

export const router = createRouter({ routeTree });
