import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  CalendarClock,
  LayoutDashboard,
  Bell,
  LogOut,
  PartyPopper,
  Sparkles,
} from 'lucide-react';
import { currentRole, currentUser, logout } from '../auth/auth';
import { initials } from '../utils/format';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

interface NavItemConfig {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  roles?: string[];
}

export default function Sidebar() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const role = currentRole();
  const user = currentUser();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const navItems: NavItemConfig[] = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'planner', 'member'] },
    { label: 'Events', to: '/events', icon: PartyPopper, roles: ['admin', 'planner', 'member'] },
    {
      label: 'Workspace',
      to: eventId ? `/events/${eventId}/overview` : '/events',
      icon: CalendarClock,
      roles: ['admin', 'planner', 'member'],
    },
    { label: 'Notifications', to: '/notifications', icon: Bell, roles: ['admin', 'planner', 'member'] },
  ];

  const visibleItems = navItems.filter((item) => !item.roles || (role && item.roles.includes(role)));

  function handleConfirmLogout() {
    logout();
    setIsLogoutOpen(false);
    navigate('/login');
  }

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-surface-border dark:border-surface-borderDark bg-white/70 dark:bg-surface-cardDark/70 backdrop-blur-xl px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-display text-lg font-semibold tracking-tight">EventForge</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white shadow-glow'
                    : 'text-muted dark:text-muted-light hover:bg-surface-card dark:hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-surface-border dark:border-surface-borderDark">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-semibold">
            {user ? initials(user.name) : 'EF'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name ?? 'Guest'}</p>
            <p className="text-xs text-muted capitalize truncate">{role ?? 'guest'}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsLogoutOpen(true)}
            aria-label="Log out"
            className="p-2 rounded-lg text-muted hover:text-danger hover:bg-danger-light dark:hover:bg-danger/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isLogoutOpen}
        title="Log out of EventForge?"
        description="You will need to sign back in to access your events."
        confirmLabel="Log out"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutOpen(false)}
      />
    </aside>
  );
}
