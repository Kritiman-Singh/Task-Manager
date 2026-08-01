package com.auth.services.impl;

import com.auth.authentication.entities.User;
import com.auth.entities.Task;
import com.auth.enums.TaskPriority;
import com.auth.enums.TaskStatus;
import com.auth.exceptions.ResourceNotFoundException;
import com.auth.repositories.TaskRepository;
import com.auth.repositories.specifications.TaskSpecification;
import com.auth.security.SecurityUtil;
import com.auth.services.TaskService;
import com.auth.dtos.task.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Override
    public TaskResponse createTask(TaskCreateRequest request) {
        User currentUser = SecurityUtil.getCurrentUser();

        Task task = Task.builder()
                .user(currentUser)
                .title(request.getTitle())
                .description(request.getDescription())
                .taskDate(request.getTaskDate())
                .startTime(request.getStartTime())
                .dueTime(request.getDueTime())
                .status(TaskStatus.PENDING)
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .category(request.getCategory())
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTodaysTasks() {
        return getTasksByDate(LocalDate.now());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByDate(LocalDate date) {
        UUID userId = SecurityUtil.getCurrentUserId();
        return taskRepository.findByUserIdAndTaskDateOrderByStartTimeAsc(userId, date)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByDateRange(LocalDate from, LocalDate to) {
        UUID userId = SecurityUtil.getCurrentUserId();
        return taskRepository.findByUserIdAndTaskDateBetweenOrderByTaskDateAscStartTimeAsc(userId, from, to)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(UUID taskId) {
        UUID userId = SecurityUtil.getCurrentUserId();
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        return mapToResponse(task);
    }

    @Override
    public TaskResponse updateTask(UUID taskId, TaskUpdateRequest request) {
        UUID userId = SecurityUtil.getCurrentUserId();
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setTaskDate(request.getTaskDate());
        task.setStartTime(request.getStartTime());
        task.setDueTime(request.getDueTime());
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        task.setCategory(request.getCategory());

        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }

    @Override
    public TaskResponse completeTask(UUID taskId) {
        UUID userId = SecurityUtil.getCurrentUserId();
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        task.setStatus(TaskStatus.COMPLETED);
        task.setCompletedAt(Instant.now());

        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    @Override
    public TaskResponse markTaskPending(UUID taskId) {
        UUID userId = SecurityUtil.getCurrentUserId();
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        task.setStatus(TaskStatus.PENDING);
        task.setCompletedAt(null);

        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    @Override
    public void deleteTask(UUID taskId) {
        UUID userId = SecurityUtil.getCurrentUserId();
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        taskRepository.delete(task);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> searchTasks(TaskSearchRequest request) {
        UUID userId = SecurityUtil.getCurrentUserId();
        Pageable pageable = createPageable(request.getPage(), request.getSize(), request.getSort());

        var spec = TaskSpecification.getSpecification(
                userId,
                request.getDate(),
                request.getFrom(),
                request.getTo(),
                request.getStatus(),
                request.getPriority(),
                request.getCategory(),
                request.getSearch()
        );

        return taskRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> getCompletedTasks(TaskSearchRequest request) {
        request.setStatus(TaskStatus.COMPLETED);
        return searchTasks(request);
    }

    private Pageable createPageable(Integer page, Integer size, String sortParam) {
        int pageNum = (page != null && page >= 0) ? page : 0;
        int pageSize = (size != null && size > 0) ? size : 10;

        Sort sort = Sort.by(Sort.Direction.DESC, "taskDate");
        if (StringUtils.hasText(sortParam)) {
            String[] parts = sortParam.split(",");
            String property = parts[0].trim();
            Sort.Direction direction = (parts.length > 1 && parts[1].trim().equalsIgnoreCase("asc"))
                    ? Sort.Direction.ASC : Sort.Direction.DESC;
            sort = Sort.by(direction, property);
        }

        return PageRequest.of(pageNum, pageSize, sort);
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .taskId(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .taskDate(task.getTaskDate())
                .startTime(task.getStartTime())
                .dueTime(task.getDueTime())
                .status(task.getStatus())
                .priority(task.getPriority())
                .category(task.getCategory())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .completedAt(task.getCompletedAt())
                .build();
    }
}
