# UrbanConnect Frontend

This client app is the frontend for UrbanConnect, a marketplace platform that connects customers with local service providers through browsing, booking, review, provider management, and admin approval workflows.

## Current Status

- React app scaffold is present
- frontend implementation has not started yet
- backend APIs, auth middleware, validation, and tests already exist in `server/`
- frontend planning backlog is documented in [public/docs/FRONTEND_JIRA_PLAN.md](./public/docs/FRONTEND_JIRA_PLAN.md)

## Planned Frontend Scope

- public browsing of services
- Clerk-based authentication and protected routes
- customer booking and review flows
- provider dashboard for profile, status, documents, and service creation
- admin dashboard for user management and provider approval actions

## Available Scripts

In the `client` directory, you can run:

### `npm start`

Runs the frontend in development mode at `http://localhost:3000`.

### `npm test`

Runs the frontend test suite.

### `npm run build`

Builds the production bundle.

## Next Step

Start with Sprint 1 from the Jira plan:

- set up frontend architecture
- add routing and shared app shell
- create API and environment foundation
- integrate Clerk on the frontend

## Notes

- This repo keeps architecture notes under `client/public/docs/`
- The backend currently runs separately from the frontend
