# Phase 10: User Profile & Settings API

## Overview
Phase 10 provides user self-service endpoints allowing authenticated users to manage their profiles and update passwords securely.

## Implemented Endpoints
- **`GET /api/v1/users/me`**: Fetches the profile of the current authenticated user (`userId`, `userName`, `email`, `image`, `provider`).
- **`PUT /api/v1/users/me`**: Updates current user's profile details (`userName`, `image`). Fields like `userId`, `email`, `provider`, and `roles` are protected and immutable.
- **`PUT /api/v1/users/me/password`**: Changes user password for `LOCAL` accounts after validating the current password.

## Security Constraints
- Password updates are permitted **only** when `user.provider == Provider.LOCAL`.
- Attempting to change passwords on social accounts (`GOOGLE`, `GITHUB`) yields an error (`400 Bad Request` / `403 Forbidden`).
