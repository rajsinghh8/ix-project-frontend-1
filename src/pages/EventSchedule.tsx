import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { AlertTriangle, CalendarClock, Plus } from 'lucide-react';
import EventTabs from '../components/EventTabs';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { SkeletonRow } from '../components/Skeletons';
import { createScheduleItem, getSchedule } from '../data/store';
import type { ScheduleItem, ScheduleType } from '../types';
import { validateRequired } from '../validation';
import { formatTime } from '../utils/format';

const TYPE_TONE: Record<ScheduleType, 'primary' | 'info' | 'warning' | 'success'> = {
  session: 'primary',
  activity: 'info',
  meeting: 'warning',
  milestone: 'success',
};

interface ScheduleFormState {
  title: string;
  type: ScheduleType;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
}

const EMPTY_FORM: ScheduleFormState = {
  title: '',
  type: 'session',
  date: '',
  startTime: '',
  endTime: '',
  location: '',
};

function toIsoString(date: string, time: string): string {
  return `${date}T${time}:00`;
}

export function EventSchedule() {
  const { eventId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<ScheduleFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState({ title: '', date: '', startTime: '', endTime: '', location: '' });
  const [conflictError, setConflictError] = useState('');

  useEffect(() => {
    if (!eventId) return;
    let isMounted = true;
    getSchedule(eventId).then((data) => {
      if (isMounted) {
        setItems(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()),
    [items]
  );

  const isValid =
    validateRequired(form.title, 'Title') === '' &&
    validateRequired(form.date, 'Date') === '' &&
    validateRequired(form.startTime, 'Start time') === '' &&
    validateRequired(form.endTime, 'End time') === '' &&
    validateRequired(form.location, 'Location') === '';

  function findConflict(start: string, end: string): ScheduleItem | undefined {
    const startMs = new Date(start).getTime();
    const endMs = new Date(end).getTime();
    return items.find((item) => {
      const itemStart = new Date(item.start).getTime();
      const itemEnd = new Date(item.end).getTime();
      return startMs < itemEnd && endMs > itemStart;
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = {
      title: validateRequired(form.title, 'Title'),
      date: validateRequired(form.date, 'Date'),
      startTime: validateRequired(form.startTime, 'Start time'),
      endTime: validateRequired(form.endTime, 'End time'),
      location: validateRequired(form.location, 'Location'),
    };
    setErrors(nextErrors);
    setConflictError('');

    if (Object.values(nextErrors).some(Boolean) || !isValid || !eventId) {
      return;
    }

    const start = toIsoString(form.date, form.startTime);
    const end = toIsoString(form.date, form.endTime);

    if (new Date(end).getTime() <= new Date(start).getTime()) {
      setConflictError('End time must be after the start time.');
      return;
    }

    const conflict = findConflict(start, end);
    if (conflict) {
      setConflictError(`This overlaps with "${conflict.title}" (${formatTime(conflict.start)} – ${formatTime(conflict.end)}).`);
      return;
    }

    const created = await createScheduleItem({
      eventId,
      title: form.title,
      type: form.type,
      start,
      end,
      location: form.location,
    });

    setItems((previous) => [...previous, created]);
    setForm(EMPTY_FORM);
    setIsModalOpen(false);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <EventTabs />
        <div className="card-surface divide-y divide-surface-border dark:divide-surface-borderDark">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <EventTabs />

      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl">Event timeline</h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-glow hover:bg-primary-600"
        >
          <Plus className="w-4 h-4" /> Add item
        </button>
      </div>

      {sortedItems.length === 0 ? (
        <EmptyState
          icon={<CalendarClock className="w-6 h-6" />}
          title="No schedule items yet"
          description="Add sessions, activities, meetings, or milestones to build the event timeline."
          action={
            <button type="button" onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold">
              Add schedule item
            </button>
          }
        />
      ) : (
        <div className="relative pl-8">
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-surface-border dark:bg-surface-borderDark" />
          <div className="space-y-6">
            {sortedItems.map((item) => (
              <div key={item.id} className="relative animate-slide-up">
                <div className="absolute -left-8 top-1.5 w-4 h-4 rounded-full bg-primary shadow-glow border-2 border-white dark:border-surface-dark" />
                <div className="card-surface p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <Badge tone={TYPE_TONE[item.type]}>{item.type}</Badge>
                  </div>
                  <p className="text-sm text-muted">
                    {formatTime(item.start)} – {formatTime(item.end)} · {item.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} title="Add schedule item" onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="schedule-title">
              Title
            </label>
            <input
              id="schedule-title"
              type="text"
              value={form.title}
              onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            {errors.title && <p className="text-xs mt-1 text-danger">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="schedule-type">
                Type
              </label>
              <select
                id="schedule-type"
                value={form.type}
                onChange={(event) => setForm((previous) => ({ ...previous, type: event.target.value as ScheduleType }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="session">Session</option>
                <option value="activity">Activity</option>
                <option value="meeting">Meeting</option>
                <option value="milestone">Milestone</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="schedule-date">
                Date
              </label>
              <input
                id="schedule-date"
                type="date"
                value={form.date}
                onChange={(event) => setForm((previous) => ({ ...previous, date: event.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              {errors.date && <p className="text-xs mt-1 text-danger">{errors.date}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="schedule-start">
                Start time
              </label>
              <input
                id="schedule-start"
                type="time"
                value={form.startTime}
                onChange={(event) => setForm((previous) => ({ ...previous, startTime: event.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              {errors.startTime && <p className="text-xs mt-1 text-danger">{errors.startTime}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="schedule-end">
                End time
              </label>
              <input
                id="schedule-end"
                type="time"
                value={form.endTime}
                onChange={(event) => setForm((previous) => ({ ...previous, endTime: event.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              {errors.endTime && <p className="text-xs mt-1 text-danger">{errors.endTime}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="schedule-location">
              Location
            </label>
            <input
              id="schedule-location"
              type="text"
              value={form.location}
              onChange={(event) => setForm((previous) => ({ ...previous, location: event.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            {errors.location && <p className="text-xs mt-1 text-danger">{errors.location}</p>}
          </div>

          {conflictError && (
            <div className="flex items-start gap-2 text-sm text-danger bg-danger-light dark:bg-danger/10 rounded-xl px-3 py-2.5">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              {conflictError}
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid}
            className="w-full py-2.5 rounded-xl font-semibold text-white bg-primary shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to timeline
          </button>
        </form>
      </Modal>
    </div>
  );
}
