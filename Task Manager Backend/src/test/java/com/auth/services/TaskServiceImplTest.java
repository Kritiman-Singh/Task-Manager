package com.auth.services;

import com.auth.authentication.entities.User;
import com.auth.dtos.task.TaskCreateRequest;
import com.auth.dtos.task.TaskResponse;
import com.auth.dtos.task.TaskUpdateRequest;
import com.auth.entities.Task;
import com.auth.enums.TaskPriority;
import com.auth.enums.TaskStatus;
import com.auth.exceptions.ResourceNotFoundException;
import com.auth.repositories.TaskRepository;
import com.auth.security.SecurityUtil;
import com.auth.services.impl.TaskServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    private TaskServiceImpl taskService;

    private User owner;
    private UUID ownerId;

    @BeforeEach
    void setUp() {
        taskService = new TaskServiceImpl(taskRepository);
        ownerId = UUID.randomUUID();
        owner = User.builder()
                .id(ownerId)
                .email("owner@example.com")
                .name("Owner")
                .roles(new HashSet<>())
                .enable(true)
                .build();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(owner, null, owner.getAuthorities())
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void createTask_bindsToAuthenticatedUser() {
        TaskCreateRequest request = TaskCreateRequest.builder()
                .title("Buy groceries")
                .taskDate(LocalDate.now())
                .priority(TaskPriority.HIGH)
                .build();

        Task saved = Task.builder()
                .id(UUID.randomUUID())
                .user(owner)
                .title(request.getTitle())
                .taskDate(request.getTaskDate())
                .priority(TaskPriority.HIGH)
                .status(TaskStatus.PENDING)
                .build();

        when(taskRepository.save(any(Task.class))).thenReturn(saved);

        TaskResponse response = taskService.createTask(request);

        assertNotNull(response);
        assertEquals(saved.getId(), response.getTaskId());
        assertEquals("Buy groceries", response.getTitle());
        assertEquals(TaskStatus.PENDING, response.getStatus());

        verify(taskRepository).save(argThat(task -> task.getUser() != null
                && task.getUser().getId().equals(ownerId)));
    }

    @Test
    void createTask_defaultsPriorityToMediumWhenNotProvided() {
        TaskCreateRequest request = TaskCreateRequest.builder()
                .title("Task without priority")
                .taskDate(LocalDate.now())
                .build();

        Task saved = Task.builder()
                .id(UUID.randomUUID())
                .user(owner)
                .title(request.getTitle())
                .taskDate(request.getTaskDate())
                .priority(TaskPriority.MEDIUM)
                .status(TaskStatus.PENDING)
                .build();

        when(taskRepository.save(any(Task.class))).thenReturn(saved);

        TaskResponse response = taskService.createTask(request);

        assertEquals(TaskPriority.MEDIUM, response.getPriority());
    }

    @Test
    void completeTask_marksTaskCompletedAndSetsCompletedAt() {
        UUID taskId = UUID.randomUUID();
        Task task = Task.builder()
                .id(taskId)
                .user(owner)
                .title("Pay bills")
                .taskDate(LocalDate.now())
                .status(TaskStatus.PENDING)
                .build();

        when(taskRepository.findByIdAndUserId(taskId, ownerId)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TaskResponse response = taskService.completeTask(taskId);

        assertEquals(TaskStatus.COMPLETED, response.getStatus());
        assertNotNull(response.getCompletedAt());
    }

    @Test
    void completeTask_throwsWhenTaskBelongsToAnotherUser() {
        UUID taskId = UUID.randomUUID();
        User otherUser = User.builder().id(UUID.randomUUID()).email("other@example.com").build();

        when(taskRepository.findByIdAndUserId(taskId, ownerId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.completeTask(taskId));
        verify(taskRepository, never()).save(any());
    }

    @Test
    void deleteTask_deletesOwnedTask() {
        UUID taskId = UUID.randomUUID();
        Task task = Task.builder()
                .id(taskId)
                .user(owner)
                .title("Delete me")
                .taskDate(LocalDate.now())
                .build();

        when(taskRepository.findByIdAndUserId(taskId, ownerId)).thenReturn(Optional.of(task));

        taskService.deleteTask(taskId);

        verify(taskRepository).delete(task);
    }

    @Test
    void deleteTask_throwsWhenTaskBelongsToAnotherUser() {
        UUID taskId = UUID.randomUUID();
        when(taskRepository.findByIdAndUserId(taskId, ownerId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.deleteTask(taskId));
        verify(taskRepository, never()).delete(any(Task.class));
    }

    @Test
    void updateTask_updatesFieldsAndKeepsOwnership() {
        UUID taskId = UUID.randomUUID();
        Task task = Task.builder()
                .id(taskId)
                .user(owner)
                .title("Old title")
                .taskDate(LocalDate.now())
                .status(TaskStatus.PENDING)
                .build();

        TaskUpdateRequest request = TaskUpdateRequest.builder()
                .title("New title")
                .taskDate(LocalDate.now().plusDays(1))
                .build();

        when(taskRepository.findByIdAndUserId(taskId, ownerId)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TaskResponse response = taskService.updateTask(taskId, request);

        assertEquals("New title", response.getTitle());
        assertEquals(LocalDate.now().plusDays(1), response.getTaskDate());
    }
}
