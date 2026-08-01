# Phase 2: Database Schema and JPA Entities

## Overview
Phase 2 establishes the database mapping and JPA entities for task management while maintaining full alignment with the existing `users` table.

## Key Enums Created
- `com.auth.enums.TaskStatus`: `PENDING`, `COMPLETED`
- `com.auth.enums.TaskPriority`: `LOW`, `MEDIUM`, `HIGH`

## Task JPA Entity Structure (`com.auth.entities.Task`)
- **Table Name**: `tasks`
- **Primary Key**: `task_id` (UUID generated via `GenerationType.UUID`)
- **Foreign Key**: `user_id` (ManyToOne to `com.auth.authentication.entities.User`, non-null)
- **Columns**:
  - `title` (VARCHAR 255, NOT NULL)
  - `description` (TEXT)
  - `task_date` (DATE, NOT NULL)
  - `start_time` (TIME)
  - `due_time` (TIME)
  - `status` (ENUM VARCHAR 20, default `PENDING`)
  - `priority` (ENUM VARCHAR 20, default `MEDIUM`)
  - `category` (VARCHAR 100)
  - `created_at` (TIMESTAMP Instant, NOT NULL, updatable = false)
  - `updated_at` (TIMESTAMP Instant)
  - `completed_at` (TIMESTAMP Instant)

## Database Indexes
The following composite/single-column indexes are configured:
1. `idx_tasks_user_date` (`user_id, task_date`)
2. `idx_tasks_user_status` (`user_id, status`)
3. `idx_tasks_user_priority` (`user_id, priority`)
4. `idx_tasks_user_created_at` (`user_id, created_at`)

## Data Ownership Guarantee
Every `Task` record is directly tied to a specific `User`. Tasks cannot exist without a valid owner (`user_id`).
