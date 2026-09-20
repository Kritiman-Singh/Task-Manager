package com.auth.services;

import com.auth.authentication.entities.User;
import com.auth.dtos.dashboard.DashboardResponse;
import com.auth.dtos.task.TaskResponse;
import com.auth.enums.TaskStatus;
import com.auth.repositories.TaskRepository;
import com.auth.security.SecurityUtil;
import com.auth.services.impl.DashboardServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private TaskService taskService;

    private DashboardServiceImpl dashboardService;

    private UUID userId;

    @BeforeEach
    void setUp() {
        dashboardService = new DashboardServiceImpl(taskRepository, taskService);
        userId = UUID.randomUUID();
        User user = User.builder().id(userId).email("owner@example.com").roles(new HashSet<>()).enable(true).build();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities())
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getDashboardData_computesCountsAndCompletionRate() {
        LocalDate today = LocalDate.now();

        when(taskRepository.countByUserIdAndTaskDate(userId, today)).thenReturn(10L);
        when(taskRepository.countByUserIdAndTaskDateAndStatus(userId, today, TaskStatus.COMPLETED)).thenReturn(4L);
        when(taskRepository.countByUserIdAndTaskDateAndStatus(userId, today, TaskStatus.PENDING)).thenReturn(6L);

        TaskResponse task1 = TaskResponse.builder().taskId(UUID.randomUUID()).title("A").taskDate(today).build();
        TaskResponse task2 = TaskResponse.builder().taskId(UUID.randomUUID()).title("B").taskDate(today).build();
        when(taskService.getTodaysTasks()).thenReturn(List.of(task1, task2));

        DashboardResponse response = dashboardService.getDashboardData();

        assertEquals(today, response.getDate());
        assertEquals(10L, response.getTotalTasks());
        assertEquals(4L, response.getCompletedTasks());
        assertEquals(6L, response.getPendingTasks());
        assertEquals(40.0, response.getCompletionRate());
        assertEquals(2, response.getTodaysTasks().size());
    }

    @Test
    void getDashboardData_completionRateIsZeroWhenNoTasks() {
        LocalDate today = LocalDate.now();

        when(taskRepository.countByUserIdAndTaskDate(userId, today)).thenReturn(0L);
        when(taskRepository.countByUserIdAndTaskDateAndStatus(eq(userId), eq(today), any(TaskStatus.class))).thenReturn(0L);
        when(taskService.getTodaysTasks()).thenReturn(List.of());

        DashboardResponse response = dashboardService.getDashboardData();

        assertEquals(0.0, response.getCompletionRate());
        assertEquals(0L, response.getTotalTasks());
    }
}
