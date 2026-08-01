package com.auth.controllers;

import com.auth.dtos.ApiResponse;
import com.auth.dtos.task.*;
import com.auth.services.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(@Valid @RequestBody TaskCreateRequest request) {
        TaskResponse response = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Task created successfully"));
    }

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTodaysTasks() {
        List<TaskResponse> tasks = taskService.getTodaysTasks();
        return ResponseEntity.ok(ApiResponse.success(tasks, "Today's tasks retrieved successfully"));
    }

    @GetMapping(params = "date")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTasksByDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<TaskResponse> tasks = taskService.getTasksByDate(date);
        return ResponseEntity.ok(ApiResponse.success(tasks, "Tasks for " + date + " retrieved successfully"));
    }

    @GetMapping("/range")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTasksByDateRange(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        List<TaskResponse> tasks = taskService.getTasksByDateRange(from, to);
        return ResponseEntity.ok(ApiResponse.success(tasks, "Tasks for date range retrieved successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<TaskResponse>>> searchTasks(TaskSearchRequest searchRequest) {
        Page<TaskResponse> tasks = taskService.searchTasks(searchRequest);
        return ResponseEntity.ok(ApiResponse.success(tasks, "Tasks retrieved successfully"));
    }

    @GetMapping("/completed")
    public ResponseEntity<ApiResponse<Page<TaskResponse>>> getCompletedTasks(TaskSearchRequest searchRequest) {
        Page<TaskResponse> completedTasks = taskService.getCompletedTasks(searchRequest);
        return ResponseEntity.ok(ApiResponse.success(completedTasks, "Completed tasks retrieved successfully"));
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable("taskId") UUID taskId) {
        TaskResponse task = taskService.getTaskById(taskId);
        return ResponseEntity.ok(ApiResponse.success(task, "Task retrieved successfully"));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable("taskId") UUID taskId,
            @Valid @RequestBody TaskUpdateRequest request
    ) {
        TaskResponse updatedTask = taskService.updateTask(taskId, request);
        return ResponseEntity.ok(ApiResponse.success(updatedTask, "Task updated successfully"));
    }

    @PatchMapping("/{taskId}/complete")
    public ResponseEntity<ApiResponse<TaskResponse>> completeTask(@PathVariable("taskId") UUID taskId) {
        TaskResponse task = taskService.completeTask(taskId);
        return ResponseEntity.ok(ApiResponse.success(task, "Task marked as completed"));
    }

    @PatchMapping("/{taskId}/pending")
    public ResponseEntity<ApiResponse<TaskResponse>> markTaskPending(@PathVariable("taskId") UUID taskId) {
        TaskResponse task = taskService.markTaskPending(taskId);
        return ResponseEntity.ok(ApiResponse.success(task, "Task marked as pending"));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable("taskId") UUID taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.ok(ApiResponse.success(null, "Task deleted successfully"));
    }
}
