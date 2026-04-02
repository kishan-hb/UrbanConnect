# UrbanConnect

UrbanConnect is a service marketplace platform that connects customers with local providers through a full booking workflow. The project is structured as a single repository with a React frontend and a Node.js/Express backend backed by MongoDB.

## What The App Does

- lets customers browse service listings and book providers
- lets providers manage their profile, approval status, documents, and services
- gives admins protected endpoints for provider approval and platform oversight
- supports reviews, booking validation, role-based access control, and backend route protection

## Tech Stack

### Frontend
- React
- React Scripts
- Jest / React Testing Library

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- Clerk for authentication
- Jest
- Supertest

## Current Backend Capabilities

- REST endpoints for users, services, bookings, reviews, admin, and providers
- business validation for booking and review flows
- Clerk middleware integration for protected routes
- authentication and role-based authorization middleware
- admin-only and provider-only route layers
- centralized validation and error-handling helpers
- automated backend tests with route and controller coverage
- reusable validation helpers for ObjectId, duplicate keys, required fields, and Mongoose validation errors

## Project Structure

```text
UrbanConnect/
  client/
    public/
    src/
  server/
    controllers/
    middleware/
    models/
    routes/
```

## Key Backend Routes

### Public / general
- `GET /`
- `GET /api/users`
- `GET /api/services`
- `GET /api/bookings`
- `GET /api/reviews`

### Auth / protected checks
- `GET /api/auth-check`
- `GET /api/protected-test`

### Admin
- `GET /api/admin/users`
- `GET /api/admin/providers/pending`
- `PATCH /api/admin/providers/:id/approve`

### Provider
- `GET /api/providers/me`
- `GET /api/providers/me/status`
- `PATCH /api/providers/me/profile`

## Architecture Notes

Supporting architecture and system design docs live in:

- [client/public/docs/SYSTEM_DESIGN.md](client/public/docs/SYSTEM_DESIGN.md)
- [client/public/docs/architecture.md](client/public/docs/architecture.md)

## Local Development

### Frontend

```bash
cd client
npm install
npm start
```

Frontend test command:

```bash
npm test
```

### Backend

```bash
cd server
npm install
npm run dev
```

Backend test command:

```bash
npm test
```

## Environment Variables

The backend expects environment configuration for:

- MongoDB connection
- Clerk publishable key
- Clerk secret key
- application port

Typical backend env keys:

- `MONGO_URI`
- `PORT`
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## Automated Testing

The backend test suite currently includes:

- route smoke tests
- auth and unauthorized access tests
- admin and provider route protection tests
- booking controller unit tests
- review controller unit tests

Backend tests live under:

- `server/tests/`

## Status

UrbanConnect currently has the backend foundation, validation layer, authentication and authorization flow, admin/provider modules, and automated backend test setup in place. The next stage is to continue frontend implementation and connect full end-to-end authenticated user flows.
