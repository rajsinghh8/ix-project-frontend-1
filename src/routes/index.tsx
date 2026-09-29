import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import RequireAuth from '../components/RequireAuth';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { ForgotPassword } from '../pages/ForgotPassword';
import { Dashboard } from '../pages/Dashboard';
import { Events } from '../pages/Events';
import { EventOverview } from '../pages/EventOverview';
import { EventTasks } from '../pages/EventTasks';
import { EventGuests } from '../pages/EventGuests';
import { EventBudget } from '../pages/EventBudget';
import { EventSchedule } from '../pages/EventSchedule';
import { EventVendors } from '../pages/EventVendors';
import { Notifications } from '../pages/Notifications';
import { NotFound } from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <App />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'events', element: <Events /> },
      { path: 'events/:eventId/overview', element: <EventOverview /> },
      { path: 'events/:eventId/tasks', element: <EventTasks /> },
      { path: 'events/:eventId/guests', element: <EventGuests /> },
      { path: 'events/:eventId/budget', element: <EventBudget /> },
      { path: 'events/:eventId/schedule', element: <EventSchedule /> },
      { path: 'events/:eventId/vendors', element: <EventVendors /> },
      { path: 'notifications', element: <Notifications /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
