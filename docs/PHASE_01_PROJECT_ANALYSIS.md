# Phase 1: Existing Project Analysis & Architecture

## Overview
This document analyzes the existing TaskFlow codebase, authentication mechanism, and Google Stitch UI screens before building backend REST APIs and performing frontend integration.

## Backend Architecture
- **Framework**: Spring Boot 3.5.13 with Java 21
- **Base Package**: `com.auth`
- **Database**: MySQL with Hibernate JPA (`ddl-auto: update`)
- **Security**: Spring Security + JWT Stateless Authentication + OAuth2 (Google & GitHub)
- **Key Classes**:
  - `User`: Entity representing users (`user_id` as `UUID`, `email`, `name`, `password`, `image`, `provider`, `roles`)
  - `Role`: Entity for role management (`ROLE_ADMIN`, `ROLE_GUEST`, etc.)
  - `RefreshToken`: Entity for JWT refresh token rotation
  - `JwtAuthenticationFilter`: Extracts JWT from request headers or cookies and populates `SecurityContextHolder`
  - `SecurityConfig`: Configures public URLs, CORS, exception entry points, and JWT filter pipeline
  - `AuthController`: Endpoint handling `/api/v1/auth/login`, `/register`, `/refresh`, `/logout`

## Stitch UI Screens (Project ID: `16585933187334309823`)
1. **Login** (`23347ea55b234d44b0828c62bc7da0a2`): Email/password, Google & GitHub login.
2. **Dashboard** (`49a7c53197a44f7f882459226c36a4cf`): Summary stats (total, completed, pending, completion rate), today's tasks list.
3. **My Tasks** (`ab84778aae674ec58e5bc377ead76af1`): Task list with search, status/priority/category filters, pagination, edit & delete buttons.
4. **Add New Task** (`27715cef30274ee382c84d62e0330654`): Modal/Form with fields: title, description, date, start time, due time, priority, category.
5. **Calendar** (`5a785872217c42f68c61528e5949a352`): Monthly view with color-coded task activity per day, date selection.
6. **Completed Tasks** (`75790b70b24d4b369a070c6470dda75a`): Table/list of completed tasks with restore-to-pending action.
7. **Analytics** (`d56029520386419193ef1339e34af02e`): Overview counters, weekly/monthly productivity breakdown charts, most productive day.
8. **Settings / Profile** (`ea9dbc4a512744a7aca6fa0e743132dc`): Profile editing (name, avatar) and password update for local users.

## Conclusion
The existing authentication infrastructure is solid and complete. We will proceed to Phase 2 to implement the `Task` entity and database mapping without breaking existing authentication.
