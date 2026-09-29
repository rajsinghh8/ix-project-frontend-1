import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarDays, MapPin, Users, Wallet, ArrowLeft } from 'lucide-react';
import EventTabs from '../components/EventTabs';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import { SkeletonGrid } from '../components/Skeletons';
import { getEvent, getGuests, getTasks } from '../data/store';
import type { EventItem, GuestItem, TaskItem } from '../types';
import { useCountdown } from '../hooks/useCountdown';
import { formatCurrency, formatDate } from '../utils/format';
import { BUDGET_WARNING_THRESHOLD, CAPACITY_WARNING_THRESHOLD } from '../constants';

export function EventOverview() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<EventItem | undefined>(undefined);
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    if (!eventId) return;
    const currentEventId: string = eventId;
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      const [eventData, guestData, taskData] = await Promise.all([
        getEvent(currentEventId),
        getGuests(currentEventId),
        getTasks(currentEventId),
      ]);
      if (!isMounted) return;
      setEvent(eventData);
      setGuests(guestData);
      setTasks(taskData);
      setIsLoading(false);
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const countdown = useCountdown(event?.date ?? new Date().toISOString());

  const rsvpBreakdown = useMemo(() => {
    const accepted = guests.filter((guest) => guest.rsvpStatus === 'accepted').length;
    const declined = guests.filter((guest) => guest.rsvpStatus === 'declined').length;
    const pending = guests.filter((guest) => guest.rsvpStatus === 'pending' || guest.rsvpStatus === 'invited').length;
    return { accepted, declined, pending, total: guests.length };
  }, [guests]);

  const completedTasks = tasks.filter((task) => task.status === 'COMPLETED').length;

  if (isLoading) {
    return <SkeletonGrid count={4} />;
  }

  if (!event) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-medium mb-2">Event not found</p>
        <button
          type="button"
          onClick={() => navigate('/events')}
          className="text-primary-600 font-medium hover:underline"
        >
          Back to events
        </button>
      </div>
    );
  }

  const attendingGuests = guests.reduce((sum, guest) => sum + 1 + guest.plusOnes, 0);
  const capacityRatio = event.capacity > 0 ? attendingGuests / event.capacity : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        type="button"
        onClick={() => navigate('/events')}
        className="flex items-center gap-2 text-sm text-muted hover:text-primary-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back to events
      </button>

      <EventTabs />

      <div className={`rounded-3xl p-8 bg-gradient-to-br ${event.coverGradient} text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <Badge tone="neutral">{event.status}</Badge>
          <h1 className="text-3xl font-display font-semibold mt-3 mb-2">{event.name}</h1>
          <p className="text-white/80 max-w-xl mb-6">{event.description}</p>

          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> {formatDate(event.date)}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {event.venue}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Capacity {event.capacity.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {countdown.isPast ? (
          <div className="card-surface p-5 col-span-1 sm:col-span-2 lg:col-span-4 text-center">
            <p className="font-display font-semibold text-lg">This event has already taken place</p>
          </div>
        ) : (
          [
            { label: 'Days', value: countdown.days },
            { label: 'Hours', value: countdown.hours },
            { label: 'Minutes', value: countdown.minutes },
            { label: 'Seconds', value: countdown.seconds },
          ].map((unit) => (
            <div key={unit.label} className="card-surface p-5 text-center">
              <p className="text-3xl font-display font-semibold text-primary-600">{unit.value}</p>
              <p className="text-sm text-muted mt-1">{unit.label}</p>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-surface p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-primary-500" />
            <h2 className="font-semibold">Guest statistics</h2>
          </div>
          <ProgressBar
            value={attendingGuests}
            max={event.capacity}
            warningThreshold={CAPACITY_WARNING_THRESHOLD}
            label={`${attendingGuests} of ${event.capacity} capacity`}
          />
          {capacityRatio >= CAPACITY_WARNING_THRESHOLD && (
            <p className="text-xs text-warning mt-2 font-medium">
              Approaching capacity — consider closing invitations soon.
            </p>
          )}
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div>
              <p className="text-lg font-semibold text-success">{rsvpBreakdown.accepted}</p>
              <p className="text-xs text-muted">Accepted</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-warning">{rsvpBreakdown.pending}</p>
              <p className="text-xs text-muted">Pending</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-danger">{rsvpBreakdown.declined}</p>
              <p className="text-xs text-muted">Declined</p>
            </div>
          </div>
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-4 h-4 text-primary-500" />
            <h2 className="font-semibold">Budget health</h2>
          </div>
          <ProgressBar
            value={event.budgetSpent}
            max={event.budgetPlanned}
            warningThreshold={BUDGET_WARNING_THRESHOLD}
            label={`${formatCurrency(event.budgetSpent)} of ${formatCurrency(event.budgetPlanned)}`}
          />
          <p className="text-sm text-muted mt-4">
            Remaining budget: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(Math.max(0, event.budgetPlanned - event.budgetSpent))}</span>
          </p>
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-primary-500" />
            <h2 className="font-semibold">Task progress</h2>
          </div>
          <ProgressBar
            value={completedTasks}
            max={tasks.length || 1}
            label={`${completedTasks} of ${tasks.length} tasks complete`}
          />
          <button
            type="button"
            onClick={() => navigate(`/events/${event.id}/tasks`)}
            className="mt-4 text-sm font-medium text-primary-600 hover:underline"
          >
            Open task board
          </button>
        </div>
      </div>
    </div>
  );
}
