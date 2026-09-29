// MOCK DATA — placeholder records for local development only.
// Replace with real API data before production use.

import type {
  ActivityItem,
  BudgetCategoryItem,
  EventItem,
  GuestItem,
  NotificationItem,
  ScheduleItem,
  TaskItem,
  User,
  VendorItem,
} from '../types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Amara Chen',
    email: 'admin@eventforge.com',
    password: 'password123',
    role: 'admin',
    avatarColor: '#6C5CE7',
  },
  {
    id: 'u2',
    name: 'Jordan Reyes',
    email: 'planner@eventforge.com',
    password: 'password123',
    role: 'planner',
    avatarColor: '#00D9C0',
  },
  {
    id: 'u3',
    name: 'Priya Nair',
    email: 'member@eventforge.com',
    password: 'password123',
    role: 'member',
    avatarColor: '#FFB020',
  },
];

export const mockEvents: EventItem[] = [
  {
    id: 'ev1',
    name: 'Lumina Product Launch',
    description: 'Flagship product unveiling with press, partners, and investors.',
    date: '2025-11-14T18:00:00',
    venue: 'The Glasshouse Pavilion, San Francisco',
    capacity: 350,
    status: 'confirmed',
    coverGradient: 'from-primary-500 via-primary-600 to-accent',
    budgetPlanned: 180000,
    budgetSpent: 121500,
  },
  {
    id: 'ev2',
    name: 'Horizon Leadership Summit',
    description: 'Two-day executive summit with keynote speakers and workshops.',
    date: '2025-12-02T09:00:00',
    venue: 'Meridian Convention Center, Austin',
    capacity: 800,
    status: 'planning',
    coverGradient: 'from-info via-primary-500 to-primary-700',
    budgetPlanned: 420000,
    budgetSpent: 96800,
  },
  {
    id: 'ev3',
    name: 'Evergreen Charity Gala',
    description: 'Annual black-tie fundraising gala supporting local nonprofits.',
    date: '2025-10-05T19:30:00',
    venue: 'Rosewood Grand Ballroom, Chicago',
    capacity: 450,
    status: 'live',
    coverGradient: 'from-danger via-primary-500 to-accent',
    budgetPlanned: 260000,
    budgetSpent: 251200,
  },
];

export const mockTasks: TaskItem[] = [
  { id: 't1', eventId: 'ev1', title: 'Confirm keynote speaker travel', description: 'Book flights and hotel for keynote speaker.', status: 'COMPLETED', priority: 'high', assignee: 'Jordan Reyes', deadline: '2025-10-20T00:00:00', dependsOn: null, createdAt: '2025-09-01T00:00:00' },
  { id: 't2', eventId: 'ev1', title: 'Finalize stage AV setup', description: 'Coordinate with AV vendor on stage layout.', status: 'IN_PROGRESS', priority: 'high', assignee: 'Priya Nair', deadline: '2025-11-01T00:00:00', dependsOn: null, createdAt: '2025-09-02T00:00:00' },
  { id: 't3', eventId: 'ev1', title: 'Press kit distribution', description: 'Send digital press kits to confirmed media.', status: 'BLOCKED', priority: 'medium', assignee: 'Amara Chen', deadline: '2025-10-25T00:00:00', dependsOn: 't1', createdAt: '2025-09-03T00:00:00' },
  { id: 't4', eventId: 'ev1', title: 'Catering tasting session', description: 'Finalize menu with catering vendor.', status: 'TODO', priority: 'medium', assignee: 'Priya Nair', deadline: '2025-11-05T00:00:00', dependsOn: null, createdAt: '2025-09-04T00:00:00' },
  { id: 't5', eventId: 'ev1', title: 'Signage and branding install', description: 'Install branded signage across venue.', status: 'TODO', priority: 'low', assignee: 'Jordan Reyes', deadline: '2025-11-13T00:00:00', dependsOn: 't2', createdAt: '2025-09-05T00:00:00' },
  { id: 't6', eventId: 'ev1', title: 'Security briefing', description: 'Walk through security plan with venue staff.', status: 'BLOCKED', priority: 'urgent', assignee: 'Amara Chen', deadline: '2025-11-10T00:00:00', dependsOn: 't2', createdAt: '2025-09-06T00:00:00' },
  { id: 't7', eventId: 'ev2', title: 'Draft summit agenda', description: 'Outline two-day session schedule.', status: 'COMPLETED', priority: 'high', assignee: 'Jordan Reyes', deadline: '2025-10-01T00:00:00', dependsOn: null, createdAt: '2025-09-01T00:00:00' },
  { id: 't8', eventId: 'ev2', title: 'Speaker outreach', description: 'Contact and confirm 12 keynote speakers.', status: 'IN_PROGRESS', priority: 'high', assignee: 'Priya Nair', deadline: '2025-11-15T00:00:00', dependsOn: 't7', createdAt: '2025-09-02T00:00:00' },
  { id: 't9', eventId: 'ev2', title: 'Workshop room allocation', description: 'Assign workshop rooms based on capacity.', status: 'TODO', priority: 'medium', assignee: 'Amara Chen', deadline: '2025-11-20T00:00:00', dependsOn: 't8', createdAt: '2025-09-03T00:00:00' },
  { id: 't10', eventId: 'ev2', title: 'Sponsor booth layout', description: 'Design sponsor expo floor plan.', status: 'TODO', priority: 'low', assignee: 'Jordan Reyes', deadline: '2025-11-25T00:00:00', dependsOn: null, createdAt: '2025-09-04T00:00:00' },
  { id: 't11', eventId: 'ev3', title: 'Auction item procurement', description: 'Secure donated items for live auction.', status: 'COMPLETED', priority: 'high', assignee: 'Priya Nair', deadline: '2025-09-15T00:00:00', dependsOn: null, createdAt: '2025-08-15T00:00:00' },
  { id: 't12', eventId: 'ev3', title: 'Guest seating chart', description: 'Finalize table assignments.', status: 'IN_PROGRESS', priority: 'urgent', assignee: 'Amara Chen', deadline: '2025-10-01T00:00:00', dependsOn: null, createdAt: '2025-08-16T00:00:00' },
  { id: 't13', eventId: 'ev3', title: 'Live auction rehearsal', description: 'Rehearse auction flow with emcee.', status: 'BLOCKED', priority: 'high', assignee: 'Jordan Reyes', deadline: '2025-10-03T00:00:00', dependsOn: 't12', createdAt: '2025-08-17T00:00:00' },
  { id: 't14', eventId: 'ev3', title: 'Florals and centerpieces', description: 'Confirm floral vendor delivery time.', status: 'TODO', priority: 'medium', assignee: 'Priya Nair', deadline: '2025-10-04T00:00:00', dependsOn: null, createdAt: '2025-08-18T00:00:00' },
];

export const mockGuests: GuestItem[] = [
  { id: 'g1', eventId: 'ev1', name: 'Liam Foster', email: 'liam.foster@example.com', rsvpStatus: 'accepted', tableNumber: 3, plusOnes: 1, createdAt: '2025-09-01T00:00:00' },
  { id: 'g2', eventId: 'ev1', name: 'Nora Whitfield', email: 'nora.w@example.com', rsvpStatus: 'accepted', tableNumber: 3, plusOnes: 0, createdAt: '2025-09-01T00:00:00' },
  { id: 'g3', eventId: 'ev1', name: 'Diego Alvarez', email: 'diego.alvarez@example.com', rsvpStatus: 'pending', tableNumber: null, plusOnes: 0, createdAt: '2025-09-02T00:00:00' },
  { id: 'g4', eventId: 'ev1', name: 'Sophie Turner', email: 'sophie.t@example.com', rsvpStatus: 'declined', tableNumber: null, plusOnes: 0, createdAt: '2025-09-02T00:00:00' },
  { id: 'g5', eventId: 'ev1', name: 'Marcus Lee', email: 'marcus.lee@example.com', rsvpStatus: 'invited', tableNumber: null, plusOnes: 0, createdAt: '2025-09-03T00:00:00' },
  { id: 'g6', eventId: 'ev1', name: 'Elena Petrova', email: 'elena.p@example.com', rsvpStatus: 'accepted', tableNumber: 4, plusOnes: 2, createdAt: '2025-09-03T00:00:00' },
  { id: 'g7', eventId: 'ev2', name: 'Tariq Hassan', email: 'tariq.h@example.com', rsvpStatus: 'accepted', tableNumber: 1, plusOnes: 0, createdAt: '2025-09-04T00:00:00' },
  { id: 'g8', eventId: 'ev2', name: 'Grace Kim', email: 'grace.kim@example.com', rsvpStatus: 'pending', tableNumber: null, plusOnes: 1, createdAt: '2025-09-04T00:00:00' },
  { id: 'g9', eventId: 'ev2', name: 'Oliver Bennett', email: 'oliver.b@example.com', rsvpStatus: 'accepted', tableNumber: 2, plusOnes: 0, createdAt: '2025-09-05T00:00:00' },
  { id: 'g10', eventId: 'ev2', name: 'Ines Dubois', email: 'ines.dubois@example.com', rsvpStatus: 'invited', tableNumber: null, plusOnes: 0, createdAt: '2025-09-05T00:00:00' },
  { id: 'g11', eventId: 'ev3', name: 'Hannah Osei', email: 'hannah.o@example.com', rsvpStatus: 'accepted', tableNumber: 5, plusOnes: 1, createdAt: '2025-08-20T00:00:00' },
  { id: 'g12', eventId: 'ev3', name: 'Victor Nguyen', email: 'victor.n@example.com', rsvpStatus: 'accepted', tableNumber: 5, plusOnes: 0, createdAt: '2025-08-20T00:00:00' },
  { id: 'g13', eventId: 'ev3', name: 'Isabella Rossi', email: 'isabella.r@example.com', rsvpStatus: 'accepted', tableNumber: 6, plusOnes: 1, createdAt: '2025-08-21T00:00:00' },
  { id: 'g14', eventId: 'ev3', name: 'Ethan Walsh', email: 'ethan.w@example.com', rsvpStatus: 'declined', tableNumber: null, plusOnes: 0, createdAt: '2025-08-21T00:00:00' },
  { id: 'g15', eventId: 'ev3', name: 'Ava Morrison', email: 'ava.m@example.com', rsvpStatus: 'accepted', tableNumber: 7, plusOnes: 2, createdAt: '2025-08-22T00:00:00' },
];

export const mockVendors: VendorItem[] = [
  { id: 'v1', eventId: 'ev1', name: 'Bright Lens Photography', service: 'Photography', cost: 12000, amountPaid: 6000, bookingStatus: 'confirmed', contact: 'hello@brightlens.com', createdAt: '2025-08-01T00:00:00' },
  { id: 'v2', eventId: 'ev1', name: 'Fork & Flame Catering', service: 'Catering', cost: 48000, amountPaid: 24000, bookingStatus: 'booked', contact: 'events@forkflame.com', createdAt: '2025-08-02T00:00:00' },
  { id: 'v3', eventId: 'ev1', name: 'Prism AV Productions', service: 'Audio & Visual', cost: 35000, amountPaid: 35000, bookingStatus: 'confirmed', contact: 'book@prismav.com', createdAt: '2025-08-03T00:00:00' },
  { id: 'v4', eventId: 'ev2', name: 'Northline Staging Co.', service: 'Staging', cost: 62000, amountPaid: 20000, bookingStatus: 'booked', contact: 'team@northlinestaging.com', createdAt: '2025-08-05T00:00:00' },
  { id: 'v5', eventId: 'ev2', name: 'Skyline Catering Group', service: 'Catering', cost: 95000, amountPaid: 30000, bookingStatus: 'inquiry', contact: 'sales@skylinecatering.com', createdAt: '2025-08-06T00:00:00' },
  { id: 'v6', eventId: 'ev2', name: 'PulseTech Audio', service: 'Audio & Visual', cost: 40000, amountPaid: 10000, bookingStatus: 'booked', contact: 'info@pulsetechaudio.com', createdAt: '2025-08-07T00:00:00' },
  { id: 'v7', eventId: 'ev3', name: 'Rosewood Florals', service: 'Floral Design', cost: 18000, amountPaid: 18000, bookingStatus: 'confirmed', contact: 'orders@rosewoodflorals.com', createdAt: '2025-07-20T00:00:00' },
  { id: 'v8', eventId: 'ev3', name: 'Grandeur Catering', service: 'Catering', cost: 120000, amountPaid: 120000, bookingStatus: 'confirmed', contact: 'events@grandeurcatering.com', createdAt: '2025-07-21T00:00:00' },
  { id: 'v9', eventId: 'ev3', name: 'Encore Entertainment', service: 'Live Music', cost: 22000, amountPaid: 11000, bookingStatus: 'booked', contact: 'bookings@encoreent.com', createdAt: '2025-07-22T00:00:00' },
  { id: 'v10', eventId: 'ev3', name: 'Momentum Valet', service: 'Valet & Parking', cost: 9000, amountPaid: 4500, bookingStatus: 'booked', contact: 'ops@momentumvalet.com', createdAt: '2025-07-23T00:00:00' },
];

export const mockSchedule: ScheduleItem[] = [
  { id: 's1', eventId: 'ev1', title: 'Doors Open & Registration', type: 'milestone', start: '2025-11-14T17:00:00', end: '2025-11-14T18:00:00', location: 'Main Lobby' },
  { id: 's2', eventId: 'ev1', title: 'Welcome Keynote', type: 'session', start: '2025-11-14T18:00:00', end: '2025-11-14T18:45:00', location: 'Main Stage' },
  { id: 's3', eventId: 'ev1', title: 'Product Demo Stations', type: 'activity', start: '2025-11-14T19:00:00', end: '2025-11-14T20:15:00', location: 'Exhibition Hall' },
  { id: 's4', eventId: 'ev1', title: 'Press Roundtable', type: 'meeting', start: '2025-11-14T19:30:00', end: '2025-11-14T20:00:00', location: 'Media Room' },
  { id: 's5', eventId: 'ev1', title: 'Networking Reception', type: 'activity', start: '2025-11-14T20:15:00', end: '2025-11-14T21:30:00', location: 'Rooftop Terrace' },
  { id: 's6', eventId: 'ev2', title: 'Opening Remarks', type: 'milestone', start: '2025-12-02T09:00:00', end: '2025-12-02T09:30:00', location: 'Hall A' },
  { id: 's7', eventId: 'ev2', title: 'Leadership Keynote Panel', type: 'session', start: '2025-12-02T09:30:00', end: '2025-12-02T10:45:00', location: 'Hall A' },
  { id: 's8', eventId: 'ev2', title: 'Breakout Workshops I', type: 'session', start: '2025-12-02T11:00:00', end: '2025-12-02T12:15:00', location: 'Rooms 101-104' },
  { id: 's9', eventId: 'ev2', title: 'Sponsor Lunch', type: 'activity', start: '2025-12-02T12:15:00', end: '2025-12-02T13:30:00', location: 'Expo Floor' },
  { id: 's10', eventId: 'ev2', title: 'Executive Strategy Meeting', type: 'meeting', start: '2025-12-02T13:45:00', end: '2025-12-02T14:45:00', location: 'Boardroom 2' },
  { id: 's11', eventId: 'ev3', title: 'Cocktail Hour', type: 'activity', start: '2025-10-05T19:30:00', end: '2025-10-05T20:30:00', location: 'Grand Foyer' },
  { id: 's12', eventId: 'ev3', title: 'Welcome & Mission Address', type: 'milestone', start: '2025-10-05T20:30:00', end: '2025-10-05T20:50:00', location: 'Grand Ballroom' },
  { id: 's13', eventId: 'ev3', title: 'Live Auction', type: 'activity', start: '2025-10-05T21:00:00', end: '2025-10-05T22:00:00', location: 'Grand Ballroom' },
  { id: 's14', eventId: 'ev3', title: 'Live Band Performance', type: 'activity', start: '2025-10-05T22:00:00', end: '2025-10-05T23:30:00', location: 'Grand Ballroom' },
];

export const mockBudgetCategories: BudgetCategoryItem[] = [
  { id: 'b1', eventId: 'ev1', category: 'Catering', planned: 50000, spent: 30000 },
  { id: 'b2', eventId: 'ev1', category: 'Audio & Visual', planned: 40000, spent: 35000 },
  { id: 'b3', eventId: 'ev1', category: 'Venue', planned: 45000, spent: 45000 },
  { id: 'b4', eventId: 'ev1', category: 'Photography', planned: 12000, spent: 6000 },
  { id: 'b5', eventId: 'ev1', category: 'Marketing', planned: 33000, spent: 5500 },
  { id: 'b6', eventId: 'ev2', category: 'Staging', planned: 70000, spent: 20000 },
  { id: 'b7', eventId: 'ev2', category: 'Catering', planned: 95000, spent: 30000 },
  { id: 'b8', eventId: 'ev2', category: 'Audio & Visual', planned: 45000, spent: 10000 },
  { id: 'b9', eventId: 'ev2', category: 'Venue', planned: 150000, spent: 30000 },
  { id: 'b10', eventId: 'ev2', category: 'Marketing', planned: 60000, spent: 6800 },
  { id: 'b11', eventId: 'ev3', category: 'Catering', planned: 120000, spent: 120000 },
  { id: 'b12', eventId: 'ev3', category: 'Floral Design', planned: 18000, spent: 18000 },
  { id: 'b13', eventId: 'ev3', category: 'Entertainment', planned: 22000, spent: 11000 },
  { id: 'b14', eventId: 'ev3', category: 'Venue', planned: 90000, spent: 90000 },
  { id: 'b15', eventId: 'ev3', category: 'Valet & Parking', planned: 10000, spent: 4500 },
];

export const mockNotifications: NotificationItem[] = [
  { id: 'n1', eventId: 'ev1', type: 'invitation', message: 'Marcus Lee was invited to Lumina Product Launch.', timestamp: '2025-09-25T09:00:00', read: false },
  { id: 'n2', eventId: 'ev1', type: 'rsvp', message: 'Sophie Turner declined the invitation.', timestamp: '2025-09-24T14:30:00', read: false },
  { id: 'n3', eventId: 'ev1', type: 'task_overdue', message: 'Press kit distribution is overdue.', timestamp: '2025-09-23T10:00:00', read: true },
  { id: 'n4', eventId: 'ev1', type: 'budget', message: 'Venue budget for Lumina Product Launch has been fully spent.', timestamp: '2025-09-22T16:00:00', read: false },
  { id: 'n5', eventId: 'ev1', type: 'vendor_payment', message: 'Photography payment is due in 3 days.', timestamp: '2025-09-21T08:00:00', read: false },
  { id: 'n6', eventId: 'ev2', type: 'deadline', message: 'Speaker outreach deadline is approaching.', timestamp: '2025-09-20T11:00:00', read: true },
  { id: 'n7', eventId: 'ev2', type: 'invitation', message: 'Ines Dubois was invited to Horizon Leadership Summit.', timestamp: '2025-09-19T13:00:00', read: true },
  { id: 'n8', eventId: 'ev2', type: 'rsvp', message: 'Oliver Bennett accepted the invitation.', timestamp: '2025-09-18T09:45:00', read: true },
  { id: 'n9', eventId: 'ev3', type: 'budget', message: 'Evergreen Charity Gala budget is at 96% utilization.', timestamp: '2025-09-17T15:00:00', read: false },
  { id: 'n10', eventId: 'ev3', type: 'task_overdue', message: 'Live auction rehearsal is blocked and overdue.', timestamp: '2025-09-16T10:30:00', read: false },
  { id: 'n11', eventId: 'ev3', type: 'vendor_payment', message: 'Encore Entertainment has an outstanding balance of $11,000.', timestamp: '2025-09-15T12:00:00', read: true },
  { id: 'n12', eventId: 'ev3', type: 'rsvp', message: 'Ethan Walsh declined the invitation.', timestamp: '2025-09-14T09:00:00', read: true },
];

export const mockActivity: ActivityItem[] = [
  { id: 'a1', eventId: 'ev1', message: 'completed Confirm keynote speaker travel', actor: 'Jordan Reyes', timestamp: '2025-09-25T10:00:00' },
  { id: 'a2', eventId: 'ev1', message: 'accepted the invitation', actor: 'Elena Petrova', timestamp: '2025-09-24T18:20:00' },
  { id: 'a3', eventId: 'ev1', message: 'updated the AV setup task', actor: 'Priya Nair', timestamp: '2025-09-24T09:15:00' },
  { id: 'a4', eventId: 'ev1', message: 'declined the invitation', actor: 'Sophie Turner', timestamp: '2025-09-23T20:00:00' },
  { id: 'a5', eventId: 'ev2', message: 'completed Draft summit agenda', actor: 'Jordan Reyes', timestamp: '2025-09-22T14:00:00' },
  { id: 'a6', eventId: 'ev2', message: 'accepted the invitation', actor: 'Oliver Bennett', timestamp: '2025-09-21T11:30:00' },
  { id: 'a7', eventId: 'ev2', message: 'added a new vendor: PulseTech Audio', actor: 'Amara Chen', timestamp: '2025-09-20T08:45:00' },
  { id: 'a8', eventId: 'ev3', message: 'completed Auction item procurement', actor: 'Priya Nair', timestamp: '2025-09-19T13:10:00' },
  { id: 'a9', eventId: 'ev3', message: 'Photography payment is due in 3 days', actor: 'System', timestamp: '2025-09-18T09:00:00' },
  { id: 'a10', eventId: 'ev3', message: 'accepted the invitation', actor: 'Isabella Rossi', timestamp: '2025-09-17T17:40:00' },
  { id: 'a11', eventId: 'ev3', message: 'moved Guest seating chart to In Progress', actor: 'Amara Chen', timestamp: '2025-09-16T10:00:00' },
  { id: 'a12', eventId: 'ev1', message: 'commented on Signage and branding install', actor: 'Jordan Reyes', timestamp: '2025-09-15T15:30:00' },
];
