import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Your event command center' },
  '/events': { title: 'Events', subtitle: 'Manage every event in one place' },
  '/notifications': { title: 'Notifications', subtitle: 'Stay on top of every update' },
};

function resolveTitle(pathname: string): { title: string; subtitle?: string } {
  if (PAGE_TITLES[pathname]) {
    return PAGE_TITLES[pathname];
  }
  if (pathname.includes('/overview')) return { title: 'Overview', subtitle: 'Event workspace' };
  if (pathname.includes('/tasks')) return { title: 'Task board', subtitle: 'Event workspace' };
  if (pathname.includes('/guests')) return { title: 'Guests', subtitle: 'Event workspace' };
  if (pathname.includes('/budget')) return { title: 'Budget', subtitle: 'Event workspace' };
  if (pathname.includes('/schedule')) return { title: 'Schedule', subtitle: 'Event workspace' };
  if (pathname.includes('/vendors')) return { title: 'Vendors', subtitle: 'Event workspace' };
  return { title: 'EventForge' };
}

function App() {
  const location = useLocation();
  const { title, subtitle } = resolveTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-surface-card dark:bg-surface-dark">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar title={title} subtitle={subtitle} />
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
