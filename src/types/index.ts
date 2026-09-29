export type UserRole = 'admin' | 'planner' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatarColor: string;
}

export type EventStatus = 'planning' | 'confirmed' | 'live' | 'completed';

export interface EventItem {
  id: string;
  name: string;
  description: string;
  date: string;
  venue: string;
  capacity: number;
  status: EventStatus;
  coverGradient: string;
  budgetPlanned: number;
  budgetSpent: number;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskItem {
  id: string;
  eventId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  deadline: string;
  dependsOn: string | null;
  createdAt: string;
}

export type RsvpStatus = 'pending' | 'accepted' | 'declined' | 'invited';

export interface GuestItem {
  id: string;
  eventId: string;
  name: string;
  email: string;
  rsvpStatus: RsvpStatus;
  tableNumber: number | null;
  plusOnes: number;
  createdAt: string;
}

export type VendorBookingStatus = 'inquiry' | 'booked' | 'confirmed' | 'cancelled';

export interface VendorItem {
  id: string;
  eventId: string;
  name: string;
  service: string;
  cost: number;
  amountPaid: number;
  bookingStatus: VendorBookingStatus;
  contact: string;
  createdAt: string;
}

export type ScheduleType = 'session' | 'activity' | 'meeting' | 'milestone';

export interface ScheduleItem {
  id: string;
  eventId: string;
  title: string;
  type: ScheduleType;
  start: string;
  end: string;
  location: string;
}

export interface BudgetCategoryItem {
  id: string;
  eventId: string;
  category: string;
  planned: number;
  spent: number;
}

export type NotificationType =
  | 'invitation'
  | 'rsvp'
  | 'task_overdue'
  | 'deadline'
  | 'budget'
  | 'vendor_payment';

export interface NotificationItem {
  id: string;
  eventId: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ActivityItem {
  id: string;
  eventId: string;
  message: string;
  actor: string;
  timestamp: string;
}

export interface AuthToken {
  email: string;
  role: UserRole;
  name: string;
}
