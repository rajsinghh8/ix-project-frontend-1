import apiClient from '../api/client';
import { mockUsers } from '../data/mockData';
import type { AuthToken, User, UserRole } from '../types';

const AUTH_TOKEN_KEY = 'auth_token';
const SIGNED_UP_USERS_KEY = 'app_users';

function getSignedUpUsers(): User[] {
  const raw = localStorage.getItem(SIGNED_UP_USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getUsers(): User[] {
  return [...mockUsers, ...getSignedUpUsers()];
}

// MOCK: stands in for POST /api/v1/auth/login
function localLogin(email: string, password: string): boolean {
  const user = getUsers().find(
    (candidate) => candidate.email === email && candidate.password === password
  );
  if (!user) {
    return false;
  }
  const token: AuthToken = { email: user.email, role: user.role, name: user.name };
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(token));
  return true;
}

// MOCK: stands in for POST /api/v1/auth/signup
function localSignup(name: string, email: string, password: string): User {
  const existing = getUsers().find((candidate) => candidate.email === email);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }
  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    role: 'member' as UserRole,
    avatarColor: '#6C5CE7',
  };
  const signedUp = getSignedUpUsers();
  signedUp.push(newUser);
  localStorage.setItem(SIGNED_UP_USERS_KEY, JSON.stringify(signedUp));
  const token: AuthToken = { email: newUser.email, role: newUser.role, name: newUser.name };
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(token));
  return newUser;
}

function localLogout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

// TODO(USE_MOCK): verify path + response shape against the real
// backend's OpenAPI schema before flipping this to false.
export const USE_MOCK = true;

export async function login(email: string, password: string): Promise<boolean> {
  if (USE_MOCK) {
    return localLogin(email, password);
  }
  const res = await apiClient.post('/api/v1/auth/login', { email, password });
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(res.data));
  return true;
}

export async function signup(name: string, email: string, password: string): Promise<User> {
  if (USE_MOCK) {
    return localSignup(name, email, password);
  }
  const res = await apiClient.post('/api/v1/auth/signup', { name, email, password });
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(res.data));
  return res.data;
}

export function logout(): void {
  localLogout();
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_TOKEN_KEY) !== null;
}

export function currentUser(): AuthToken | null {
  const raw = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthToken;
  } catch {
    return null;
  }
}

export function currentRole(): UserRole | null {
  return currentUser()?.role ?? null;
}
