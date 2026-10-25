# Phase 16: Testing Strategy

## Unit Tests
| Layer | Test Target | Strategy |
|---|---|---|
| `TaskServiceImpl` | `createTask()`, `completeTask()`, `deleteTask()` | Mock `TaskRepository` with Mockito, verify ownership checks (user_id from SecurityContextHolder) |
| `DashboardServiceImpl` | `getDashboardData()` | Mock repository count queries, verify calculations |
| `StatisticsServiceImpl` | `getTodayStats()`, `getWeekStats()` | Verify date range calc and rate rounding |
| `UserProfileServiceImpl` | `changePassword()` | Verify `LOCAL` provider check, `BadCredentials` exception on wrong current password |

## Integration Tests (Key Security Tests)
| Test Name | Scenario | Expected |
|---|---|---|
| `testUserCannotAccessOtherUserTask` | User A requests task belonging to User B | `404 NOT_FOUND` |
| `testUserCannotUpdateOtherUserTask` | User A puts update to User B's task | `404 NOT_FOUND` |
| `testUserCannotDeleteOtherUserTask` | User A deletes User B's task | `404 NOT_FOUND` |
| `testUnauthenticatedCannotAccessTasks` | No JWT token | `401 UNAUTHORIZED` |
| `testDashboardOnlyShowsCurrentUserTasks` | Two users have tasks | `completedTasks` count only reflects authenticated user |

## Running Tests
```bash
.\mvnw.cmd test
```
