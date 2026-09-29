import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { Bell, CalendarClock, LayoutDashboard, LogOut, PartyPopper, Sparkles, X } from 'lucide-react';
import { currentRole, logout } from '../auth/auth';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const role = currentRole();

  if (!isOpen) {
    return null;
  }

  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Events', to: '/events', icon: PartyPopper },
    { label: 'Workspace', to: eventId ? `/events/${eventId}/overview` : '/events', icon: CalendarClock },
    { label: 'Notifications', to: '/notifications', icon: Bell },
  ];

  function handleLogout() {
    logout();
    onClose();
    navigate('/login');
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-surface-cardDark p-5 flex flex-col animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold">EventForge</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close navigation" className="p-2 rounded-lg hover:bg-surface-card">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive ? 'bg-primary text-white' : 'text-muted hover:bg-surface-card dark:hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {role && (
          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger-light dark:hover:bg-danger/10"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        )}
      </div>
    </div>
  );
}
