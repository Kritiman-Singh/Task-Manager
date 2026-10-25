# Phase 3: DTO and Validation Layer

## Overview
Phase 3 defines all request and response Data Transfer Objects (DTOs) ensuring JPA entities are never directly exposed over REST APIs. Jakarta Bean Validation is applied to validate incoming request bodies.

## Created DTOs
1. **Generic Wrapper**: `com.auth.dtos.ApiResponse<T>` (`success`, `message`, `errorCode`, `data`, `errors`, `timestamp`)
2. **Task DTOs** (`com.auth.dtos.task`):
   - `TaskCreateRequest`: Validates `@NotBlank title`, `@NotNull taskDate`, optional `description`, `startTime`, `dueTime`, `priority`, `category`.
   - `TaskUpdateRequest`: Validates task fields for updates.
   - `TaskResponse`: Clean representation of task fields including `taskId`, `status`, `priority`, and timestamps.
   - `TaskSearchRequest`: Container for query filters (`date`, `from`, `to`, `status`, `priority`, `category`, `search`, `page`, `size`, `sort`).
3. **Dashboard DTO**: `com.auth.dtos.dashboard.DashboardResponse` (`date`, `totalTasks`, `completedTasks`, `pendingTasks`, `completionRate`, `todaysTasks`, `recentTasks`).
4. **Statistics DTOs**: `com.auth.dtos.stats.TaskStatisticsResponse` & `DailyBreakdown`.
5. **Calendar DTO**: `com.auth.dtos.calendar.CalendarDayResponse`.
6. **Analytics DTO**: `com.auth.dtos.analytics.AnalyticsResponse` (`today`, `thisWeek`, `thisMonth`, `mostProductiveDay`, `weeklyProductivity`, `monthlyProductivity`).
7. **User Profile DTOs** (`com.auth.dtos.user`):
   - `UserProfileResponse`: Safe user representation (`userId`, `userName`, `email`, `image`, `provider`).
   - `UpdateUserProfileRequest`: Allows updating `userName` and `image` safely.
   - `ChangePasswordRequest`: Validates `currentPassword` and `newPassword` (min 6 chars).

## Security Rule
No DTO accepts a `userId` field from request payloads. Authenticated identity is resolved strictly via server-side Security Context.
