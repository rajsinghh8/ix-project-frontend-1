import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import type { EventItem } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import ProgressBar from './ProgressBar';
import Badge from './Badge';
import { BUDGET_WARNING_THRESHOLD } from '../constants';

interface EventCardProps {
  event: EventItem;
}

const STATUS_TONE: Record<EventItem['status'], 'info' | 'success' | 'warning' | 'neutral'> = {
  planning: 'info',
  confirmed: 'success',
  live: 'warning',
  completed: 'neutral',
};

export default function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/events/${event.id}/overview`)}
      className="card-surface overflow-hidden cursor-pointer group hover:-translate-y-1 hover:shadow-glow transition-all duration-300"
    >
      <div className={`h-28 bg-gradient-to-br ${event.coverGradient} relative flex items-end p-4`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        <Badge tone={STATUS_TONE[event.status]}>{event.status}</Badge>
      </div>
      <div className="p-5">
        <h3 className="font-display font-semibold text-lg mb-1 truncate">{event.name}</h3>
        <p className="text-sm text-muted mb-4 line-clamp-2">{event.description}</p>

        <div className="flex flex-col gap-2 text-sm text-muted mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary-500" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-500" />
            Capacity {event.capacity.toLocaleString()}
          </div>
        </div>

        <ProgressBar
          value={event.budgetSpent}
          max={event.budgetPlanned}
          warningThreshold={BUDGET_WARNING_THRESHOLD}
          label={`${formatCurrency(event.budgetSpent)} of ${formatCurrency(event.budgetPlanned)}`}
        />
      </div>
    </div>
  );
}
