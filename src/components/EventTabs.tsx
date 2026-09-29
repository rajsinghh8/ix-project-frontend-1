import { NavLink, useParams } from 'react-router-dom';

const TABS = [
  { label: 'Overview', segment: 'overview' },
  { label: 'Tasks', segment: 'tasks' },
  { label: 'Guests', segment: 'guests' },
  { label: 'Budget', segment: 'budget' },
  { label: 'Schedule', segment: 'schedule' },
  { label: 'Vendors', segment: 'vendors' },
];

export default function EventTabs() {
  const { eventId } = useParams();

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-6 border-b border-surface-border dark:border-surface-borderDark">
      {TABS.map((tab) => (
        <NavLink
          key={tab.segment}
          to={`/events/${eventId}/${tab.segment}`}
          className={({ isActive }) =>
            `px-4 py-2.5 rounded-t-xl text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              isActive
                ? 'border-primary text-primary-600 dark:text-primary-300'
                : 'border-transparent text-muted hover:text-primary-600'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
