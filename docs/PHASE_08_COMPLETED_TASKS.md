# Phase 8: Completed Tasks API

## Overview
Phase 8 provides specialized endpoints to view, search, filter, and manage completed tasks, supporting the Stitch Completed Tasks screen.

## Endpoints
- **`GET /api/v1/tasks/completed`**: Fetches all completed tasks for the authenticated user, supporting search text, category filter, priority filter, and pagination.
- **`PATCH /api/v1/tasks/{taskId}/pending`**: Restores a completed task back to `PENDING` state and resets `completedAt` to `null`.
- **`DELETE /api/v1/tasks/{taskId}`**: Permanently deletes a completed task.
