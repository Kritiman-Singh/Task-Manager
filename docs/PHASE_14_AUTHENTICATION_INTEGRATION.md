# Phase 14: Authentication Integration & Token Handling

## Overview
Phase 14 documents the full existing JWT authentication integration already wired into the frontend and ensures the TaskFlow API calls benefit from the existing token refresh logic.

## Authentication Flow
1. **Login** (`POST /api/v1/auth/login`): Returns `{ accessToken, user }`. Token stored in `localStorage` via Zustand store.
2. **OAuth Success** (`/oauth/success` page): Processes OAuth redirect with access token from query params.
3. **Bootstrap** (`GET /api/v1/auth/me`): Called on app load to restore session.
4. **Token Refresh** (Axios interceptor in `ApiClient.js`): On `401` responses, automatically calls `POST /api/v1/auth/refresh` (using httpOnly refresh cookie) to get a new access token, then retries the failed request.

## Protected Routes
- **`ProtectedRoute`** component in `main.jsx` checks Zustand `status` field.
- While `status === "authenticating"` (bootstrap in progress), shows a loading spinner.
- If `status !== "authenticated"`, redirects to `/login`.
- All task management pages (`/dashboard/**`) are protected.

## `ApiClient.js` Features
- Auto-attaches `Authorization: Bearer <token>` to every request via request interceptor.
- `withCredentials: true` ensures refresh-token cookies are sent automatically.
- Queues concurrent requests during refresh to prevent thundering herd.
