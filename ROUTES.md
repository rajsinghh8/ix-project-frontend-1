# xyz — Routes & Navigation

## How to run
cd /workspace/frontend_runs/86b472e2-49f8-4f56-ada5-be220ee73a36/project
npm install --legacy-peer-deps && npm run dev
Then open http://localhost:46965

## Routes

| Route | Page file | Description |
|-------|-----------|-------------|
| / | redirects | Redirects to /dashboard (inside the protected layout) |
| /login | src/pages/Login.tsx | Sign-in screen with mock auth, "Forgot password?" link |
| /signup | src/pages/Signup.tsx | Account creation screen with validation |
| /forgot-password | src/pages/ForgotPassword.tsx | Placeholder password-reset request flow |
| /dashboard | src/pages/Dashboard.tsx | Cross-event stats, budget chart, upcoming schedule, activity feed |
| /events | src/pages/Events.tsx | Searchable/filterable list of all events |
| /events/:eventId/overview | src/pages/EventOverview.tsx | Event info, countdown, guest/budget/task health |
| /events/:eventId/tasks | src/pages/EventTasks.tsx | Kanban task board (TODO/IN PROGRESS/BLOCKED/COMPLETED) |
| /events/:eventId/guests | src/pages/EventGuests.tsx | Guest list, RSVP stats, capacity indicator, invite form |
| /events/:eventId/budget | src/pages/EventBudget.tsx | Budget dashboard with charts and vendor costs |
| /events/:eventId/schedule | src/pages/EventSchedule.tsx | Visual timeline with overlap/conflict validation |
| /events/:eventId/vendors | src/pages/EventVendors.tsx | Vendor cards with cost/paid/remaining tracking |
| /notifications | src/pages/Notifications.tsx | Notification center + activity timeline |
| * | src/pages/NotFound.tsx | 404 with a link back home |

## Navigation map
- Sidebar / mobile drawer -> Dashboard, Events, Workspace (current event or Events), Notifications
- Dashboard -> Events (View all button)
- Dashboard -> Event overview (clicking an event row)
- Dashboard -> Event schedule (clicking an upcoming schedule item)
- Events -> Event overview (clicking an event card)
- Event overview -> Event tasks (Open task board button)
- EventTabs (Overview/Tasks/Guests/Budget/Schedule/Vendors) -> switches between event workspace routes for the current event
- Notifications -> Event overview (clicking a notification)
- Login -> Dashboard (successful sign in)
- Login -> Signup (Sign up link)
- Login -> Forgot password (Forgot password? link)
- Signup -> Dashboard (successful sign up)
- Signup -> Login (Sign in link)
- Sidebar/mobile drawer Logout -> confirm dialog -> Login
- Any unauthenticated visit to a protected route -> Login (RequireAuth redirect)
- Any unknown URL -> NotFound -> Go home -> Dashboard

## Shared components
- Sidebar.tsx — desktop nav with role-aware items and logout confirm dialog
- TopBar.tsx — page title, theme toggle, mobile menu trigger
- MobileNavDrawer.tsx — slide-in nav for small screens
- EventTabs.tsx — sub-navigation across an event's workspace tabs
- StatCard.tsx — animated-counter stat card used on the dashboard
- ProgressBar.tsx — budget/capacity/task progress bar with warning colors
- Badge.tsx — status/priority pill
- Avatar.tsx — initials avatar
- EventCard.tsx — event summary card used in the Events list
- EmptyState.tsx — empty-state placeholder for lists with no data
- Skeletons.tsx — SkeletonCard/SkeletonRow/SkeletonGrid loading placeholders
- Modal.tsx — base modal dialog
- ConfirmDialog.tsx — destructive-action confirmation dialog built on Modal
- RequireAuth.tsx — route guard redirecting unauthenticated users to /login

## Design tokens
- primary (#6C5CE7, 50-900 scale) — main brand/action color
- accent (#00D9C0, light #5FF5E0) — secondary highlight color
- surface (white / dark #12101A, card #F8F7FC, cardDark #1B1826, border #E7E4F2, borderDark #2E2A3E)
- muted (#6B667A, light #9C97AC) — secondary text
- danger (#FF5A6E, light #FFE3E7) — errors, blocked/overdue states
- success (#22C58B, light #DFF8ED) — completed/accepted states
- warning (#FFB020, light #FFF3DA) — approaching-limit states
- info (#3E9BFF, light #E3F1FF) — informational states
- gradients: gradient-primary, gradient-dark, gradient-radial
