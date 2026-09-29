import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  DollarSign,
  PartyPopper,
  Users,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { SkeletonGrid, SkeletonRow } from '../components/Skeletons';
import { getActivity, getEvents, getSchedule, getTasks, getVendors } from '../data/store';
import type { EventItem, ScheduleItem, TaskItem, ActivityItem, VendorItem } from '../types';
import { formatCurrency, formatDateTime, timeAgo } from '../utils/format';
import { BUDGET_WARNING_THRESHOLD } from '../constants';

export function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [allTasks, setAllTasks] = useState<TaskItem[]>([]);
  const [allSchedule, setAllSchedule] = useState<ScheduleItem[]>([]);
  const [allVendors, setAllVendors] = useState<VendorItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setIsLoading(true);
      const eventList = await getEvents();
      const [tasksByEvent, scheduleByEvent, vendorsByEvent, activityFeed] = await Promise.all([
        Promise.all(eventList.map((event) => getTasks(event.id))),
        Promise.all(eventList.map((event) => getSchedule(event.id))),
        Promise.all(eventList.map((event) => getVendors(event.id))),
        getActivity(),
      ]);

      if (!isMounted) return;

      setEvents(eventList);
      setAllTasks(tasksByEvent.flat());
      setAllSchedule(scheduleByEvent.flat());
      setAllVendors(vendorsByEvent.flat());
      setActivity(activityFeed);
      setIsLoading(false);
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalGuestCount = useMemo(() => events.reduce((sum, event) => sum + event.capacity, 0), [events]);
  const totalBudgetPlanned = useMemo(() => events.reduce((sum, event) => sum + event.budgetPlanned, 0), [events]);
  const totalBudgetSpent = useMemo(() => events.reduce((sum, event) => sum + event.budgetSpent, 0), [events]);

  const pendingTasks = useMemo(
    () => allTasks.filter((task) => task.status === 'TODO' || task.status === 'IN_PROGRESS'),
    [allTasks]
  );
  const overdueTasks = useMemo(
    () => allTasks.filter((task) => task.status !== 'COMPLETED' && new Date(task.deadline).getTime() < Date.now()),
    [allTasks]
  );
  const vendorBalance = useMemo(
    () => allVendors.reduce((sum, vendor) => sum + (vendor.cost - vendor.amountPaid), 0),
    [allVendors]
  );

  const upcomingSchedule = useMemo(
    () =>
      allSchedule
        .filter((item) => new Date(item.start).getTime() > Date.now())
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
        .slice(0, 5),
    [allSchedule]
  );

  // MOCK: derived chart series built from budget planned/spent across events, standing in for a real time-series endpoint.
  const budgetChartData = useMemo(
    () =>
      events.map((event) => ({
        name: event.name.split(' ')[0],
        planned: event.budgetPlanned,
        spent: event.budgetSpent,
      })),
    [events]
  );

  function eventNameFor(eventId: string): string {
    return events.find((event) => event.id === eventId)?.name ?? 'Event';
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonGrid count={6} />
        <div className="card-surface p-5 space-y-2">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          label="Upcoming events"
          value={events.length}
          icon={<PartyPopper className="w-5 h-5" />}
          accentClassName="bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300"
        />
        <StatCard
          label="Total guest capacity"
          value={totalGuestCount}
          icon={<Users className="w-5 h-5" />}
          accentClassName="bg-info-light text-info dark:bg-info/15"
        />
        <StatCard
          label="Budget spent"
          value={totalBudgetSpent}
          prefix="$"
          icon={<Wallet className="w-5 h-5" />}
          accentClassName="bg-success-light text-success dark:bg-success/15"
        />
        <StatCard
          label="Pending tasks"
          value={pendingTasks.length}
          icon={<Clock className="w-5 h-5" />}
          accentClassName="bg-warning-light text-warning dark:bg-warning/15"
        />
        <StatCard
          label="Overdue tasks"
          value={overdueTasks.length}
          icon={<AlertTriangle className="w-5 h-5" />}
          accentClassName="bg-danger-light text-danger dark:bg-danger/15"
        />
        <StatCard
          label="Vendor balance due"
          value={vendorBalance}
          prefix="$"
          icon={<DollarSign className="w-5 h-5" />}
          accentClassName="bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg">Budget usage across events</h2>
            <Badge tone="primary">{formatCurrency(totalBudgetSpent)} / {formatCurrency(totalBudgetPlanned)}</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={budgetChartData}>
                <defs>
                  <linearGradient id="plannedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6C5CE7" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6C5CE7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D9C0" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#00D9C0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,141,178,0.2)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9C97AC" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9C97AC" tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                <Area type="monotone" dataKey="planned" stroke="#6C5CE7" fill="url(#plannedGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="spent" stroke="#00D9C0" fill="url(#spentGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-6">
          <h2 className="font-display font-semibold text-lg mb-4">Upcoming schedule</h2>
          {upcomingSchedule.length === 0 ? (
            <EmptyState
              icon={<CalendarClock className="w-6 h-6" />}
              title="Nothing scheduled"
              description="No upcoming sessions across your events yet."
            />
          ) : (
            <div className="space-y-4">
              {upcomingSchedule.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/events/${item.eventId}/schedule`)}
                  className="flex items-start gap-3 cursor-pointer hover:bg-surface-card dark:hover:bg-white/5 rounded-xl p-2 -mx-2 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-500/15 text-primary-600 dark:text-primary-300 flex items-center justify-center shrink-0">
                    <CalendarClock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted truncate">
                      {eventNameFor(item.eventId)} · {formatDateTime(item.start)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg">Events overview</h2>
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/events/${event.id}/overview`)}
                className="cursor-pointer hover:bg-surface-card dark:hover:bg-white/5 rounded-xl p-3 -mx-3 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{event.name}</p>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {event.status}
                  </span>
                </div>
                <ProgressBar
                  value={event.budgetSpent}
                  max={event.budgetPlanned}
                  warningThreshold={BUDGET_WARNING_THRESHOLD}
                  showPercentLabel={false}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface p-6">
          <h2 className="font-display font-semibold text-lg mb-4">Recent activity</h2>
          {activity.length === 0 ? (
            <EmptyState
              icon={<Clock className="w-6 h-6" />}
              title="No activity yet"
              description="Actions across your events will show up here."
            />
          ) : (
            <ul className="space-y-4">
              {activity.slice(0, 6).map((item) => (
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
    </div>
  );
}
