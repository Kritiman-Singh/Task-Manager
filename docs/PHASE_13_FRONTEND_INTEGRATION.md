# Phase 13: Frontend Integration with Real APIs

## Overview
Phase 13 replaces all mock/placeholder data in the React frontend with real API calls to the Spring Boot backend.

## New Files Created

### Services
- **`src/services/task.service.js`**: Complete Axios client for all task, dashboard, calendar, analytics, and profile endpoints.

### Utilities
- **`src/utils/task.utils.js`**: Shared helpers for date/time formatting (`formatDate`, `formatTime`, `formatInstant`), priority/status color mapping.

### Components
- **`src/components/task/TaskFormDialog.jsx`**: Modal form for creating and editing tasks with validation.
- **`src/components/task/TaskCard.jsx`**: Single task card with complete/pending toggle, edit button, and delete button.
- **`src/components/ui/textarea.jsx`**: Textarea shadcn-style UI component.

### Pages (New)
- **`src/pages/user/DashboardPage.jsx`**: Shows summary stats + today's tasks. Connects to `GET /api/v1/dashboard`.
- **`src/pages/user/MyTasksPage.jsx`**: Paginated task list with search and filters. Connects to `GET /api/v1/tasks/search`.
- **`src/pages/user/CalendarPage.jsx`**: Monthly grid with daily task activity. Connects to `GET /api/v1/calendar` and `GET /api/v1/tasks?date=`.
- **`src/pages/user/CompletedTasksPage.jsx`**: Lists completed tasks with restore/delete. Connects to `GET /api/v1/tasks/completed`.
- **`src/pages/user/AnalyticsPage.jsx`**: Productivity charts and stats. Connects to `GET /api/v1/analytics/overview`.
- **`src/pages/user/SettingsPage.jsx`**: Profile editing and password change. Connects to `GET/PUT /api/v1/users/me` and `PUT /api/v1/users/me/password`.
- **`src/pages/user/TaskLayout.jsx`**: Full sidebar navigation layout for all task management pages.

### Updated
- **`src/main.jsx`**: Full routing configuration with protected routes.
- **`src/pages/app.layout.jsx`**: Hides global Navbar for dashboard routes (TaskLayout has its own sidebar).

## npm Dependencies Added
- `date-fns`: Date/time formatting
- `@radix-ui/react-select`: Select component
- `@radix-ui/react-popover`: Popover component
- `@radix-ui/react-scroll-area`: Scroll area component
