import type { TaskPriority, TaskStatus } from '../types';

export const ROUTES = {
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  events: '/events',
  eventOverview: (eventId: string) => `/events/${eventId}/overview`,
  eventTasks: (eventId: string) => `/events/${eventId}/tasks`,
  eventGuests: (eventId: string) => `/events/${eventId}/guests`,
  eventBudget: (eventId: string) => `/events/${eventId}/budget`,
  eventSchedule: (eventId: string) => `/events/${eventId}/schedule`,
  eventVendors: (eventId: string) => `/events/${eventId}/vendors`,
  notifications: '/notifications',
};

export const TASK_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED'];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  BLOCKED: 'Blocked',
  COMPLETED: 'Completed',
};

export const TASK_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];

export const GUEST_PAGE_SIZE = 8;

export const BUDGET_WARNING_THRESHOLD = 0.85;

export const CAPACITY_WARNING_THRESHOLD = 0.9;

export const MIN_PASSWORD_LENGTH = 6;
