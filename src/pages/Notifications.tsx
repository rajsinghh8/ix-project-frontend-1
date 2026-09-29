import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Bell,
  CalendarClock,
  CheckCheck,
  Mail,
  UserCheck,
  Wallet,
} from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { SkeletonRow } from '../components/Skeletons';
import { getActivity, getNotifications, markNotificationRead } from '../data/store';
import type { ActivityItem, NotificationItem, NotificationType } from '../types';
import { timeAgo } from '../utils/format';

const TYPE_ICON: Record<NotificationType, typeof Bell> = {
  invitation: Mail,
  rsvp: UserCheck,
  task_overdue: AlertTriangle,
  deadline: CalendarClock,
  budget: Wallet,
  vendor_payment: Wallet,
};

const TYPE_ACCENT: Record<NotificationType, string> = {
  invitation: 'bg-info-light text-info dark:bg-info/15',
  rsvp: 'bg-success-light text-success dark:bg-success/15',
  task_overdue: 'bg-danger-light text-danger dark:bg-danger/15',
  deadline: 'bg-warning-light text-warning dark:bg-warning/15',
  budget: 'bg-danger-light text-danger dark:bg-danger/15',
  vendor_payment: 'bg-warning-light text-warning dark:bg-warning/15',
};

export function Notifications() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const [notificationData, activityData] = await Promise.all([getNotifications(), getActivity()]);
      if (!isMounted) return;
      setNotifications(notificationData);
      setActivity(activityData);
      setIsLoading(false);
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleNotifications = useMemo(
    () =>
      [...notifications]
        .filter((notification) => filter === 'all' || !notification.read)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [notifications, filter]
  );

  const sortedActivity = useMemo(
    () => [...activity].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [activity]
  );

  async function handleMarkRead(notification: NotificationItem) {
    const updated = await markNotificationRead(notification.id);
    if (updated) {
      setNotifications((previous) => previous.map((item) => (item.id === updated.id ? updated : item)));
    }
  }

  if (isLoading) {
    return (
      <div className="card-surface divide-y divide-surface-border dark:divide-surface-borderDark">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-xl">Notification center</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                filter === 'all' ? 'bg-primary text-white' : 'bg-surface-card dark:bg-white/5 text-muted'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                filter === 'unread' ? 'bg-primary text-white' : 'bg-surface-card dark:bg-white/5 text-muted'
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        {visibleNotifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-6 h-6" />}
            title="You're all caught up"
            description="New invitations, RSVPs, overdue tasks, and budget alerts will show up here."
          />
        ) : (
          <div className="card-surface divide-y divide-surface-border dark:divide-surface-borderDark">
            {visibleNotifications.map((notification) => {
              const Icon = TYPE_ICON[notification.type];
              return (
                <div
                  key={notification.id}
                  onClick={() => navigate(`/events/${notification.eventId}/overview`)}
                  className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-surface-card dark:hover:bg-white/5 transition-colors ${
                    !notification.read ? 'bg-primary-50/50 dark:bg-primary-500/5' : ''
                  }`}
                >
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${TYPE_ACCENT[notification.type]}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted mt-1">{timeAgo(notification.timestamp)}</p>
                  </div>
                  {!notification.read && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleMarkRead(notification);
                      }}
                      aria-label="Mark as read"
                      className="p-1.5 rounded-lg text-muted hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card-surface p-6">
        <h2 className="font-semibold mb-4">Activity timeline</h2>
        {sortedActivity.length === 0 ? (
          <EmptyState
            icon={<CalendarClock className="w-6 h-6" />}
            title="No activity yet"
            description="Actions across your events will appear here."
          />
        ) : (
          <ul className="space-y-4">
            {sortedActivity.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0" />
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{item.actor}</span> {item.message}
                  </p>
                  <p className="text-xs text-muted">{timeAgo(item.timestamp)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
