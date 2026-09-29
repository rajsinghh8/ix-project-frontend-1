import { useEffect, useState } from 'react';
import { Search, PartyPopper } from 'lucide-react';
import EventCard from '../components/EventCard';
import EmptyState from '../components/EmptyState';
import { SkeletonGrid } from '../components/Skeletons';
import { getEvents } from '../data/store';
import type { EventItem, EventStatus } from '../types';

const STATUS_FILTERS: Array<{ label: string; value: EventStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Planning', value: 'planning' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Live', value: 'live' },
  { label: 'Completed', value: 'completed' },
];

export function Events() {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');

  useEffect(() => {
    let isMounted = true;
    getEvents().then((data) => {
      if (isMounted) {
        setEvents(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search events or venues…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-white dark:bg-surface-cardDark text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === filter.value
                  ? 'bg-primary text-white shadow-glow'
                  : 'bg-surface-card dark:bg-white/5 text-muted hover:text-primary-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <SkeletonGrid count={6} />
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          icon={<PartyPopper className="w-6 h-6" />}
          title="No events found"
          description="Try adjusting your search or filters to find the event you're looking for."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
