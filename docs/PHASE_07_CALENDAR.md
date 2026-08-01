# Phase 7: Calendar API

## Overview
Phase 7 delivers calendar data aggregation endpoints mapping daily task activity for monthly views in the Stitch Calendar UI.

## Endpoint Details
- **Path**: `GET /api/v1/calendar?month=YYYY-MM` (Defaults to current month if omitted)
- **Response**: `ApiResponse<List<CalendarDayResponse>>`
  - Each item contains: `date`, `totalTasks`, `completedTasks`, `pendingTasks`, `completionRate`.

## Interaction Flow
- **Month Navigation**: Requests calendar data for target `YearMonth`.
- **Date Selection**: When a specific date is clicked on the UI, the frontend issues `GET /api/v1/tasks?date=YYYY-MM-DD` to load task details for that day.
