package com.auth.services;

import com.auth.dtos.task.*;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TaskService {

    TaskResponse createTask(TaskCreateRequest request);

    List<TaskResponse> getTodaysTasks();

    List<TaskResponse> getTasksByDate(LocalDate date);

    List<TaskResponse> getTasksByDateRange(LocalDate from, LocalDate to);

    TaskResponse getTaskById(UUID taskId);

    TaskResponse updateTask(UUID taskId, TaskUpdateRequest request);

    TaskResponse completeTask(UUID taskId);

    TaskResponse markTaskPending(UUID taskId);

    void deleteTask(UUID taskId);

    Page<TaskResponse> searchTasks(TaskSearchRequest searchRequest);

    Page<TaskResponse> getCompletedTasks(TaskSearchRequest searchRequest);
}
