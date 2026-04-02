# UrbanConnect Frontend Jira Plan

## Goal

Build the React frontend in a way that connects cleanly to the completed backend and delivers the first end-to-end user, provider, and admin flows.

## Planning Assumptions

- Frontend uses the existing React app in `client/`
- Backend API runs from `server/` and exposes users, services, bookings, reviews, provider, and admin routes
- Clerk will be used for frontend authentication because the backend already uses Clerk middleware
- Work will be delivered in small vertical slices so we can test each flow before moving on

## Suggested Jira Epics

### Epic 1: Frontend Foundation And App Shell

**Outcome:** The frontend has routing, shared layout, environment config, API utilities, and a reusable UI structure.

**Stories**

1. **Set up frontend architecture**
   - Subtask: Create `src/pages`, `src/components`, `src/services`, and `src/utils` folders
   - Subtask: Define initial routing structure for public, protected, provider, and admin pages
   - Subtask: Add shared app shell with header, nav, footer, and loading state
   - Subtask: Clean out placeholder app content

2. **Create API and environment foundation**
   - Subtask: Add frontend environment variable pattern for API base URL
   - Subtask: Create reusable API client wrapper for GET, POST, PATCH, PUT, DELETE
   - Subtask: Add centralized request error handling
   - Subtask: Add helper for auth-aware requests

3. **Create base design system**
   - Subtask: Define color, spacing, typography, and layout tokens
   - Subtask: Build reusable button, input, card, badge, and empty-state components
   - Subtask: Add global page container and section patterns
   - Subtask: Ensure responsive behavior for mobile and desktop

4. **Build public navigation and app routes**
   - Subtask: Add landing page route
   - Subtask: Add services listing route
   - Subtask: Add service details route
   - Subtask: Add not-found route

### Epic 2: Authentication And User Access

**Outcome:** Users can authenticate, sync profile state, and access the correct protected pages by role.

**Stories**

1. **Integrate Clerk in the frontend**
   - Subtask: Install and configure Clerk frontend package
   - Subtask: Add Clerk provider at app entry
   - Subtask: Add sign-in, sign-up, and sign-out entry points
   - Subtask: Add environment variables for Clerk publishable key

2. **Create protected route handling**
   - Subtask: Build protected route wrapper
   - Subtask: Build role-aware route wrapper for customer, provider, and admin access
   - Subtask: Add unauthorized and access-denied states
   - Subtask: Add session loading state

3. **Sync frontend auth with backend user records**
   - Subtask: Call `POST /api/users` after authenticated onboarding
   - Subtask: Load current user data by Clerk ID
   - Subtask: Store current role and profile state in frontend context
   - Subtask: Show role-aware navigation links

### Epic 3: Customer Marketplace Flow

**Outcome:** Customers can browse services, view details, create bookings, and submit reviews.

**Stories**

1. **Build services discovery experience**
   - Subtask: Fetch and render `GET /api/services`
   - Subtask: Create service cards and list layout
   - Subtask: Add loading, empty, and error states
   - Subtask: Add basic filtering or search UI if time permits

2. **Build service details page**
   - Subtask: Fetch and render `GET /api/services/:id`
   - Subtask: Show provider summary, pricing, and service metadata
   - Subtask: Link out to provider profile where available
   - Subtask: Add booking CTA

3. **Build booking flow for customers**
   - Subtask: Create booking form UI
   - Subtask: Submit to `POST /api/bookings`
   - Subtask: Show validation and success feedback
   - Subtask: Prevent non-customer users from booking

4. **Build reviews experience**
   - Subtask: Fetch and render `GET /api/reviews`
   - Subtask: Filter reviews by service or provider in the UI
   - Subtask: Create review submission form
   - Subtask: Submit to `POST /api/reviews`

### Epic 4: Provider Workspace

**Outcome:** Providers can manage profile data, review approval status, upload document info, and create services.

**Stories**

1. **Build provider dashboard shell**
   - Subtask: Add provider dashboard route and navigation
   - Subtask: Add provider summary cards and status panel
   - Subtask: Fetch provider profile with `GET /api/providers/me`
   - Subtask: Fetch provider approval status with `GET /api/providers/me/status`

2. **Build provider profile management**
   - Subtask: Create editable provider profile form
   - Subtask: Submit profile updates to `PATCH /api/providers/me/profile`
   - Subtask: Display backend validation messages
   - Subtask: Add optimistic or reload-based success state

3. **Build provider document flow**
   - Subtask: Create provider documents form
   - Subtask: Submit to `PATCH /api/providers/me/documents`
   - Subtask: Show approval-related guidance in the UI
   - Subtask: Add status messaging for pending, approved, and rejected states

4. **Build provider service management**
   - Subtask: Fetch provider services with `GET /api/providers/me/services`
   - Subtask: Create service creation form
   - Subtask: Submit new service to `POST /api/services`
   - Subtask: Refresh dashboard after service creation

### Epic 5: Admin Dashboard

**Outcome:** Admins can review users and manage provider approvals from the frontend.

**Stories**

1. **Build admin dashboard shell**
   - Subtask: Add admin-only route and navigation
   - Subtask: Create overview cards for users and provider queues
   - Subtask: Add table or list layout for moderation tasks
   - Subtask: Add loading and error states

2. **Build user management view**
   - Subtask: Fetch and display `GET /api/admin/users`
   - Subtask: Add user details view from `GET /api/admin/users/:id`
   - Subtask: Add activate action using `PATCH /api/admin/users/:id/activate`
   - Subtask: Add deactivate action using `PATCH /api/admin/users/:id/deactivate`

3. **Build provider approval workflow**
   - Subtask: Fetch pending providers with `GET /api/admin/providers/pending`
   - Subtask: Fetch approved providers with `GET /api/admin/providers/approved`
   - Subtask: Add approve action using `PATCH /api/admin/providers/:id/approve`
   - Subtask: Add reject action using `PATCH /api/admin/providers/:id/reject`

### Epic 6: Frontend Quality, QA, And Release Readiness

**Outcome:** The frontend is tested, documented, and ready for repeatable local development and release prep.

**Stories**

1. **Add frontend test coverage**
   - Subtask: Add tests for route rendering and navigation
   - Subtask: Add tests for protected route behavior
   - Subtask: Add tests for service list, booking form, and dashboard states
   - Subtask: Mock backend and auth states in tests

2. **Harden UX states**
   - Subtask: Add empty states across all major pages
   - Subtask: Add reusable error banner and retry pattern
   - Subtask: Add loading skeletons or spinners
   - Subtask: Review responsive layout issues

3. **Document frontend setup**
   - Subtask: Replace boilerplate client README
   - Subtask: Document env vars and local startup steps
   - Subtask: Document page structure and service layer
   - Subtask: Add sprint demo checklist

## Suggested Sprint Breakdown

### Sprint 1: Foundation And Auth Plumbing

**Target:** Get the app ready for real feature work.

- Epic 1 Story 1
- Epic 1 Story 2
- Epic 1 Story 4
- Epic 2 Story 1
- Epic 2 Story 2

### Sprint 2: Customer Core Flow

**Target:** Deliver the first user-facing marketplace experience.

- Epic 1 Story 3
- Epic 2 Story 3
- Epic 3 Story 1
- Epic 3 Story 2
- Epic 3 Story 3

### Sprint 3: Reviews And Provider Workspace

**Target:** Complete customer feedback and provider self-service flows.

- Epic 3 Story 4
- Epic 4 Story 1
- Epic 4 Story 2
- Epic 4 Story 3
- Epic 4 Story 4

### Sprint 4: Admin And Frontend Hardening

**Target:** Finish role coverage and improve delivery quality.

- Epic 5 Story 1
- Epic 5 Story 2
- Epic 5 Story 3
- Epic 6 Story 1
- Epic 6 Story 2
- Epic 6 Story 3

## Recommended First Sprint Starting Point

If we work step by step, the best first implementation ticket is:

**Story:** Set up frontend architecture

Why this one first:

- the client app is still a placeholder
- every later feature depends on routing and folder structure
- it gives us a clean base for auth and API integration next

## Suggested Jira Labels

- `frontend`
- `react`
- `auth`
- `customer-flow`
- `provider-flow`
- `admin-flow`
- `ui`
- `api-integration`
- `testing`

