# Phase 15: Swagger / OpenAPI Documentation

## Overview
The backend already includes `springdoc-openapi-starter-webmvc-ui` in `pom.xml`.
Swagger UI is accessible at `http://localhost:8082/swagger-ui.html` when the backend is running.

## Swagger Config Location
`com.auth.authenticationConfig.APIDocConfig` (existing class)

## Public Swagger Endpoints (already configured in AppConstants)
- `/v3/api-docs/**`
- `/swagger-ui.html`
- `/swagger-ui/**`

## New Task Management API Groups
All new controllers in `com.auth.controllers` are auto-discovered by springdoc:
- `TaskController` – `/api/v1/tasks/**`
- `DashboardController` – `/api/v1/dashboard`
- `TaskStatisticsController` – `/api/v1/tasks/stats/**`
- `CalendarController` – `/api/v1/calendar`
- `AnalyticsController` – `/api/v1/analytics/**`
- `UserProfileController` – `/api/v1/users/me/**`

## Access
After starting the backend server, visit:
```
http://localhost:8082/swagger-ui.html
```
