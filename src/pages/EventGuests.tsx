import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Search, Users } from 'lucide-react';
import EventTabs from '../components/EventTabs';
import Badge from '../components/Badge';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import ProgressBar from '../components/ProgressBar';
import { SkeletonRow } from '../components/Skeletons';
import { createGuest, getEvent, getGuests } from '../data/store';
import type { EventItem, GuestItem, RsvpStatus } from '../types';
import { CAPACITY_WARNING_THRESHOLD, GUEST_PAGE_SIZE } from '../constants';
import { validateEmail, validateRequired } from '../validation';

const RSVP_TONE: Record<RsvpStatus, 'success' | 'danger' | 'warning' | 'neutral'> = {
  accepted: 'success',
  declined: 'danger',
  pending: 'warning',
  invited: 'neutral',
};

interface GuestFormState {
  name: string;
  email: string;
  plusOnes: string;
}

const EMPTY_FORM: GuestFormState = { name: '', email: '', plusOnes: '0' };

export function EventGuests() {
  const { eventId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<EventItem | undefined>(undefined);
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RsvpStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<GuestFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState({ name: '', email: '' });

  useEffect(() => {
    if (!eventId) return;
    const currentEventId: string = eventId;
    let isMounted = true;

    async function load() {
      const [eventData, guestData] = await Promise.all([getEvent(currentEventId), getGuests(currentEventId)]);
      if (!isMounted) return;
      setEvent(eventData);
      setGuests(guestData);
      setIsLoading(false);
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const matchesStatus = statusFilter === 'all' || guest.rsvpStatus === statusFilter;
      const matchesSearch =
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [guests, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / GUEST_PAGE_SIZE));
  const pagedGuests = filteredGuests.slice((page - 1) * GUEST_PAGE_SIZE, page * GUEST_PAGE_SIZE);

  const rsvpStats = useMemo(() => {
    const accepted = guests.filter((guest) => guest.rsvpStatus === 'accepted').length;
    const declined = guests.filter((guest) => guest.rsvpStatus === 'declined').length;
    const pending = guests.filter((guest) => guest.rsvpStatus === 'pending' || guest.rsvpStatus === 'invited').length;
    return { accepted, declined, pending };
  }, [guests]);

  const attendingGuests = guests.reduce((sum, guest) => sum + 1 + guest.plusOnes, 0);
  const capacityRatio = event && event.capacity > 0 ? attendingGuests / event.capacity : 0;

  const isValid = validateRequired(form.name, 'Name') === '' && validateEmail(form.email) === '';

  async function handleSubmit(formEvent: FormEvent) {
    formEvent.preventDefault();
    const nextErrors = { name: validateRequired(form.name, 'Name'), email: validateEmail(form.email) };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.email || !isValid || !eventId) {
      return;
    }

    const created = await createGuest({
      eventId,
      name: form.name,
      email: form.email,
      rsvpStatus: 'invited',
      tableNumber: null,
      plusOnes: Number(form.plusOnes) || 0,
    });

    setGuests((previous) => [created, ...previous]);
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

      {event && (
        <div className="card-surface p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Capacity</h2>
            <span className={`text-sm font-semibold ${capacityRatio >= CAPACITY_WARNING_THRESHOLD ? 'text-danger' : 'text-primary-600'}`}>
              {attendingGuests} / {event.capacity}
            </span>
          </div>
          <ProgressBar value={attendingGuests} max={event.capacity} warningThreshold={CAPACITY_WARNING_THRESHOLD} showPercentLabel={false} />
          {capacityRatio >= CAPACITY_WARNING_THRESHOLD && (
            <p className="text-sm text-danger font-medium mt-3 flex items-center gap-2">
              This event is nearly at capacity — review pending invitations before adding more guests.
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="card-surface p-4 text-center">
          <p className="text-xl font-semibold text-success">{rsvpStats.accepted}</p>
          <p className="text-xs text-muted">Accepted</p>
        </div>
        <div className="card-surface p-4 text-center">
          <p className="text-xl font-semibold text-warning">{rsvpStats.pending}</p>
          <p className="text-xs text-muted">Pending</p>
        </div>
        <div className="card-surface p-4 text-center">
          <p className="text-xl font-semibold text-danger">{rsvpStats.declined}</p>
          <p className="text-xs text-muted">Declined</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(inputEvent) => {
              setSearchQuery(inputEvent.target.value);
              setPage(1);
            }}
            placeholder="Search guests…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-white dark:bg-surface-cardDark text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(selectEvent) => {
              setStatusFilter(selectEvent.target.value as RsvpStatus | 'all');
              setPage(1);
            }}
            className="px-3 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-white dark:bg-surface-cardDark text-sm"
          >
            <option value="all">All statuses</option>
            <option value="accepted">Accepted</option>
            <option value="pending">Pending</option>
            <option value="invited">Invited</option>
            <option value="declined">Declined</option>
          </select>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-glow hover:bg-primary-600"
          >
            <Plus className="w-4 h-4" /> Invite guest
          </button>
        </div>
      </div>

      {filteredGuests.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No guests found"
          description="Invite guests to start tracking RSVPs for this event."
          action={
            <button type="button" onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold">
              Invite a guest
            </button>
          }
        />
      ) : (
        <div className="card-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-left text-muted border-b border-surface-border dark:border-surface-borderDark">
              <tr>
                <th className="px-5 py-3 font-medium">Guest</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">RSVP</th>
                <th className="px-5 py-3 font-medium">Table</th>
                <th className="px-5 py-3 font-medium">+1s</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border dark:divide-surface-borderDark">
              {pagedGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-surface-card dark:hover:bg-white/5">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={guest.name} size="sm" />
                      <span className="font-medium">{guest.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted">{guest.email}</td>
                  <td className="px-5 py-3">
                    <Badge tone={RSVP_TONE[guest.rsvpStatus]}>{guest.rsvpStatus}</Badge>
                  </td>
                  <td className="px-5 py-3 text-muted">{guest.tableNumber ?? '—'}</td>
                  <td className="px-5 py-3 text-muted">{guest.plusOnes}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-surface-border dark:border-surface-borderDark text-sm">
              <span className="text-muted">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                  className="px-3 py-1.5 rounded-lg border border-surface-border dark:border-surface-borderDark disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
                  className="px-3 py-1.5 rounded-lg border border-surface-border dark:border-surface-borderDark disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} title="Invite guest" onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="guest-name">
              Full name
            </label>
            <input
              id="guest-name"
              type="text"
              value={form.name}
              onChange={(inputEvent) => setForm((previous) => ({ ...previous, name: inputEvent.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            {errors.name && <p className="text-xs mt-1 text-danger">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="guest-email">
              Email
            </label>
            <input
              id="guest-email"
              type="email"
              value={form.email}
              onChange={(inputEvent) => setForm((previous) => ({ ...previous, email: inputEvent.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            {errors.email && <p className="text-xs mt-1 text-danger">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="guest-plus-ones">
              Plus ones
            </label>
            <input
              id="guest-plus-ones"
              type="number"
              min={0}
              max={5}
              value={form.plusOnes}
              onChange={(inputEvent) => setForm((previous) => ({ ...previous, plusOnes: inputEvent.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            <p className="text-xs text-muted mt-1">Between 0 and 5 additional guests</p>
          </div>
          <button
            type="submit"
            disabled={!isValid}
            className="w-full py-2.5 rounded-xl font-semibold text-white bg-primary shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send invitation
          </button>
        </form>
      </Modal>
    </div>
  );
}
