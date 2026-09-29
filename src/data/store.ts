import apiClient from '../api/client';
import {
  mockActivity,
  mockBudgetCategories,
  mockEvents,
  mockGuests,
  mockNotifications,
  mockSchedule,
  mockTasks,
  mockVendors,
} from './mockData';
import type {
  ActivityItem,
  BudgetCategoryItem,
  EventItem,
  GuestItem,
  NotificationItem,
  ScheduleItem,
  TaskItem,
  VendorItem,
} from '../types';

// TODO(USE_MOCK): verify path + response shape against the real
// backend's OpenAPI schema before flipping this to false.
export const USE_MOCK = true;

function readCollection<T>(key: string, seed: T[]): T[] {
  const raw = localStorage.getItem(key);
  if (raw) {
    return JSON.parse(raw);
  }
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

function writeCollection<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

// ---------------------------------------------------------------------------
// Events (read-only dataset — no create/edit/delete UI in this build)
// ---------------------------------------------------------------------------

// MOCK: stands in for GET /api/v1/events
function localGetEvents(): EventItem[] {
  return readCollection('events', mockEvents);
}

// MOCK: stands in for GET /api/v1/events/:id
function localGetEvent(id: string): EventItem | undefined {
  return readCollection('events', mockEvents).find((event) => event.id === id);
}

export async function getEvents(): Promise<EventItem[]> {
  if (USE_MOCK) return localGetEvents();
  const res = await apiClient.get('/api/v1/events');
  return res.data;
}

export async function getEvent(id: string): Promise<EventItem | undefined> {
  if (USE_MOCK) return localGetEvent(id);
  const res = await apiClient.get(`/api/v1/events/${id}`);
  return res.data;
}

// ---------------------------------------------------------------------------
// Tasks (creatable — Kanban board)
// ---------------------------------------------------------------------------

// MOCK: stands in for GET /api/v1/tasks?eventId=
function localGetTasks(eventId: string): TaskItem[] {
  return readCollection('tasks', mockTasks).filter((task) => task.eventId === eventId);
}

// MOCK: stands in for GET /api/v1/tasks/:id
function localGetTask(id: string): TaskItem | undefined {
  return readCollection('tasks', mockTasks).find((task) => task.id === id);
}

// MOCK: stands in for POST /api/v1/tasks
function localCreateTask(input: Omit<TaskItem, 'id' | 'createdAt'>): TaskItem {
  const all = readCollection('tasks', mockTasks);
  const task: TaskItem = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  all.unshift(task);
  writeCollection('tasks', all);
  return task;
}

// MOCK: stands in for PATCH /api/v1/tasks/:id
function localUpdateTask(id: string, updates: Partial<TaskItem>): TaskItem | undefined {
  const all = readCollection('tasks', mockTasks);
  const index = all.findIndex((task) => task.id === id);
  if (index === -1) return undefined;
  all[index] = { ...all[index], ...updates };
  writeCollection('tasks', all);
  return all[index];
}

// MOCK: stands in for DELETE /api/v1/tasks/:id
function localDeleteTask(id: string): void {
  const all = readCollection('tasks', mockTasks).filter((task) => task.id !== id);
  writeCollection('tasks', all);
}

export async function getTasks(eventId: string): Promise<TaskItem[]> {
  if (USE_MOCK) return localGetTasks(eventId);
  const res = await apiClient.get('/api/v1/tasks', { params: { eventId } });
  return res.data;
}

export async function getTask(id: string): Promise<TaskItem | undefined> {
  if (USE_MOCK) return localGetTask(id);
  const res = await apiClient.get(`/api/v1/tasks/${id}`);
  return res.data;
}

export async function createTask(input: Omit<TaskItem, 'id' | 'createdAt'>): Promise<TaskItem> {
  if (USE_MOCK) return localCreateTask(input);
  const res = await apiClient.post('/api/v1/tasks', input);
  return res.data;
}

export async function updateTask(id: string, updates: Partial<TaskItem>): Promise<TaskItem | undefined> {
  if (USE_MOCK) return localUpdateTask(id, updates);
  const res = await apiClient.patch(`/api/v1/tasks/${id}`, updates);
  return res.data;
}

export async function deleteTask(id: string): Promise<void> {
  if (USE_MOCK) return localDeleteTask(id);
  await apiClient.delete(`/api/v1/tasks/${id}`);
}

// ---------------------------------------------------------------------------
// Guests (creatable — invitation workflow)
// ---------------------------------------------------------------------------

// MOCK: stands in for GET /api/v1/guests?eventId=
function localGetGuests(eventId: string): GuestItem[] {
  return readCollection('guests', mockGuests).filter((guest) => guest.eventId === eventId);
}

// MOCK: stands in for GET /api/v1/guests/:id
function localGetGuest(id: string): GuestItem | undefined {
  return readCollection('guests', mockGuests).find((guest) => guest.id === id);
}

// MOCK: stands in for POST /api/v1/guests
function localCreateGuest(input: Omit<GuestItem, 'id' | 'createdAt'>): GuestItem {
  const all = readCollection('guests', mockGuests);
  const guest: GuestItem = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  all.unshift(guest);
  writeCollection('guests', all);
  return guest;
}

// MOCK: stands in for PATCH /api/v1/guests/:id
function localUpdateGuest(id: string, updates: Partial<GuestItem>): GuestItem | undefined {
  const all = readCollection('guests', mockGuests);
  const index = all.findIndex((guest) => guest.id === id);
  if (index === -1) return undefined;
  all[index] = { ...all[index], ...updates };
  writeCollection('guests', all);
  return all[index];
}

// MOCK: stands in for DELETE /api/v1/guests/:id
function localDeleteGuest(id: string): void {
  const all = readCollection('guests', mockGuests).filter((guest) => guest.id !== id);
  writeCollection('guests', all);
}

export async function getGuests(eventId: string): Promise<GuestItem[]> {
  if (USE_MOCK) return localGetGuests(eventId);
  const res = await apiClient.get('/api/v1/guests', { params: { eventId } });
  return res.data;
}

export async function getGuest(id: string): Promise<GuestItem | undefined> {
  if (USE_MOCK) return localGetGuest(id);
  const res = await apiClient.get(`/api/v1/guests/${id}`);
  return res.data;
}

export async function createGuest(input: Omit<GuestItem, 'id' | 'createdAt'>): Promise<GuestItem> {
  if (USE_MOCK) return localCreateGuest(input);
  const res = await apiClient.post('/api/v1/guests', input);
  return res.data;
}

export async function updateGuest(id: string, updates: Partial<GuestItem>): Promise<GuestItem | undefined> {
  if (USE_MOCK) return localUpdateGuest(id, updates);
  const res = await apiClient.patch(`/api/v1/guests/${id}`, updates);
  return res.data;
}

export async function deleteGuest(id: string): Promise<void> {
  if (USE_MOCK) return localDeleteGuest(id);
  await apiClient.delete(`/api/v1/guests/${id}`);
}

// ---------------------------------------------------------------------------
// Vendors (creatable)
// ---------------------------------------------------------------------------

// MOCK: stands in for GET /api/v1/vendors?eventId=
function localGetVendors(eventId: string): VendorItem[] {
  return readCollection('vendors', mockVendors).filter((vendor) => vendor.eventId === eventId);
}

// MOCK: stands in for GET /api/v1/vendors/:id
function localGetVendor(id: string): VendorItem | undefined {
  return readCollection('vendors', mockVendors).find((vendor) => vendor.id === id);
}

// MOCK: stands in for POST /api/v1/vendors
function localCreateVendor(input: Omit<VendorItem, 'id' | 'createdAt'>): VendorItem {
  const all = readCollection('vendors', mockVendors);
  const vendor: VendorItem = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  all.unshift(vendor);
  writeCollection('vendors', all);
  return vendor;
}

// MOCK: stands in for DELETE /api/v1/vendors/:id
function localDeleteVendor(id: string): void {
  const all = readCollection('vendors', mockVendors).filter((vendor) => vendor.id !== id);
  writeCollection('vendors', all);
}

export async function getVendors(eventId: string): Promise<VendorItem[]> {
  if (USE_MOCK) return localGetVendors(eventId);
  const res = await apiClient.get('/api/v1/vendors', { params: { eventId } });
  return res.data;
}

export async function getVendor(id: string): Promise<VendorItem | undefined> {
  if (USE_MOCK) return localGetVendor(id);
  const res = await apiClient.get(`/api/v1/vendors/${id}`);
  return res.data;
}

export async function createVendor(input: Omit<VendorItem, 'id' | 'createdAt'>): Promise<VendorItem> {
  if (USE_MOCK) return localCreateVendor(input);
  const res = await apiClient.post('/api/v1/vendors', input);
  return res.data;
}

export async function deleteVendor(id: string): Promise<void> {
  if (USE_MOCK) return localDeleteVendor(id);
  await apiClient.delete(`/api/v1/vendors/${id}`);
}

// ---------------------------------------------------------------------------
// Schedule (creatable — conflict validation happens in the form/page)
// ---------------------------------------------------------------------------

// MOCK: stands in for GET /api/v1/schedule?eventId=
function localGetSchedule(eventId: string): ScheduleItem[] {
  return readCollection('schedule', mockSchedule).filter((item) => item.eventId === eventId);
}

// MOCK: stands in for POST /api/v1/schedule
function localCreateScheduleItem(input: Omit<ScheduleItem, 'id'>): ScheduleItem {
  const all = readCollection('schedule', mockSchedule);
  const item: ScheduleItem = { ...input, id: crypto.randomUUID() };
  all.push(item);
  writeCollection('schedule', all);
  return item;
}

// MOCK: stands in for DELETE /api/v1/schedule/:id
function localDeleteScheduleItem(id: string): void {
  const all = readCollection('schedule', mockSchedule).filter((item) => item.id !== id);
  writeCollection('schedule', all);
}

export async function getSchedule(eventId: string): Promise<ScheduleItem[]> {
  if (USE_MOCK) return localGetSchedule(eventId);
  const res = await apiClient.get('/api/v1/schedule', { params: { eventId } });
  return res.data;
}

export async function createScheduleItem(input: Omit<ScheduleItem, 'id'>): Promise<ScheduleItem> {
  if (USE_MOCK) return localCreateScheduleItem(input);
  const res = await apiClient.post('/api/v1/schedule', input);
  return res.data;
}

export async function deleteScheduleItem(id: string): Promise<void> {
  if (USE_MOCK) return localDeleteScheduleItem(id);
  await apiClient.delete(`/api/v1/schedule/${id}`);
}

// ---------------------------------------------------------------------------
// Budget categories (read-only dataset)
// ---------------------------------------------------------------------------

// MOCK: stands in for GET /api/v1/budget-categories?eventId=
function localGetBudgetCategories(eventId: string): BudgetCategoryItem[] {
  return readCollection('budgetCategories', mockBudgetCategories).filter(
    (category) => category.eventId === eventId
  );
}

export async function getBudgetCategories(eventId: string): Promise<BudgetCategoryItem[]> {
  if (USE_MOCK) return localGetBudgetCategories(eventId);
  const res = await apiClient.get('/api/v1/budget-categories', { params: { eventId } });
  return res.data;
}

// ---------------------------------------------------------------------------
// Notifications (read-only dataset, but toggling read state persists)
// ---------------------------------------------------------------------------

// MOCK: stands in for GET /api/v1/notifications
function localGetNotifications(): NotificationItem[] {
  return readCollection('notifications', mockNotifications);
}

// MOCK: stands in for PATCH /api/v1/notifications/:id
function localMarkNotificationRead(id: string): NotificationItem | undefined {
  const all = readCollection('notifications', mockNotifications);
  const index = all.findIndex((notification) => notification.id === id);
  if (index === -1) return undefined;
  all[index] = { ...all[index], read: true };
  writeCollection('notifications', all);
  return all[index];
}

export async function getNotifications(): Promise<NotificationItem[]> {
  if (USE_MOCK) return localGetNotifications();
  const res = await apiClient.get('/api/v1/notifications');
  return res.data;
}

export async function markNotificationRead(id: string): Promise<NotificationItem | undefined> {
  if (USE_MOCK) return localMarkNotificationRead(id);
  const res = await apiClient.patch(`/api/v1/notifications/${id}`, { read: true });
  return res.data;
}

// ---------------------------------------------------------------------------
// Activity feed (read-only dataset)
// ---------------------------------------------------------------------------

// MOCK: stands in for GET /api/v1/activity
function localGetActivity(): ActivityItem[] {
  return readCollection('activity', mockActivity);
}

export async function getActivity(): Promise<ActivityItem[]> {
  if (USE_MOCK) return localGetActivity();
  const res = await apiClient.get('/api/v1/activity');
  return res.data;
}
