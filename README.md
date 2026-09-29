# xyz

EventForge is an event planning and coordination platform. It gives planners a
command-center dashboard across all their events, plus a dedicated workspace
per event covering overview/countdown, a Kanban task board with dependency
blocking, guest management with RSVP tracking and capacity warnings, an
interactive budget dashboard with category breakdowns and vendor costs, a
conflict-checked event timeline, vendor payment tracking, and a notification
and activity center.

## Tech stack
React + TypeScript, Vite, Tailwind CSS, React Router, axios.

## Getting started
```
npm install --legacy-peer-deps
cp .env.example .env
npm run dev
```
Then open http://localhost:46965

Demo accounts (password `password123`):
- admin@eventforge.com (admin)
- planner@eventforge.com (planner)
- member@eventforge.com (member)

## Environment variables
See .env.example. VITE_API_URL is optional — every entity runs on local
mock data (USE_MOCK = true in src/data/store.ts and src/auth/auth.ts) until
it's set and each entity's flag is flipped to false.

## Project structure
- src/pages — one file per screen (Dashboard, Events, Event workspace tabs, Notifications, auth screens, NotFound)
- src/components — shared UI (Sidebar, TopBar, EventTabs, StatCard, ProgressBar, Badge, Avatar, Modal, ConfirmDialog, EmptyState, Skeletons, EventCard, RequireAuth, MobileNavDrawer)
- src/data — mock data, seeded localStorage-backed CRUD store
- src/api — shared axios client with auth header and toast-on-error interceptor
- src/auth — mock/gated authentication helpers
- src/context — theme (dark/light) context
- src/hooks — useAnimatedCounter, useCountdown
- src/constants — route helpers, task/priority enums, thresholds
- src/validation — shared field validators
- src/utils — currency/date formatting helpers
- src/types — shared TypeScript types
