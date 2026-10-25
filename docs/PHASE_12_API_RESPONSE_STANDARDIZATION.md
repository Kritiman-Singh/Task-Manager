# Phase 12: API Response Standardization & Global Exception Handling

## Overview
Phase 12 standardizes all backend REST responses using `ApiResponse<T>` wrapper objects and provides unified centralized exception handling.

## Response Structure
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": { ... },
  "timestamp": "2026-07-31T23:30:00"
}
```

## Error Structure
```json
{
  "success": false,
  "message": "Task not found with id: ...",
  "errorCode": "RESOURCE_NOT_FOUND",
  "timestamp": "2026-07-31T23:30:00"
}
```

## Handled Exceptions
- `ResourceNotFoundException` -> `404 NOT_FOUND`
- `UnauthorizedResourceAccessException` -> `403 FORBIDDEN`
- `BadCredentialsException` -> `401 UNAUTHORIZED`
- `MethodArgumentNotValidException` -> `400 BAD_REQUEST` with detailed field error map
- `IllegalStateException` / `IllegalArgumentException` -> `400 BAD_REQUEST`
- `Exception` -> `500 INTERNAL_SERVER_ERROR`
