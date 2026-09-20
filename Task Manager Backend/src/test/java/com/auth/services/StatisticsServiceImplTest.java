package com.auth.services;

import com.auth.authentication.entities.User;
import com.auth.dtos.stats.DailyBreakdown;
import com.auth.dtos.stats.TaskStatisticsResponse;
import com.auth.enums.TaskStatus;
import com.auth.repositories.TaskRepository;
import com.auth.services.impl.StatisticsServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StatisticsServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    private StatisticsServiceImpl statisticsService;

    private UUID userId;

    @BeforeEach
    void setUp() {
        statisticsService = new StatisticsServiceImpl(taskRepository);
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
    void getTodayStats_computesRateAndSingleDayBreakdown() {
        LocalDate today = LocalDate.now();

        when(taskRepository.countByUserIdAndTaskDateBetween(userId, today, today)).thenReturn(10L);
        when(taskRepository.countByUserIdAndTaskDateBetweenAndStatus(userId, today, today, TaskStatus.COMPLETED)).thenReturn(5L);
        when(taskRepository.countByUserIdAndTaskDateBetweenAndStatus(userId, today, today, TaskStatus.PENDING)).thenReturn(5L);

        Object[] row = {today, 10L, 5L, 5L};
        when(taskRepository.AggregateTaskActivityByDateRange(userId, today, today)).thenReturn(List.<Object[]>of(row));

        TaskStatisticsResponse response = statisticsService.getTodayStats();

        assertEquals(10L, response.getTotalTasks());
        assertEquals(5L, response.getCompletedTasks());
        assertEquals(5L, response.getPendingTasks());
        assertEquals(50.0, response.getCompletionRate());
        assertEquals(1, response.getBreakdown().size());
    }

    @Test
    void getWeekStats_buildsSevenDayBreakdown() {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        when(taskRepository.countByUserIdAndTaskDateBetween(userId, startOfWeek, endOfWeek)).thenReturn(7L);
        when(taskRepository.countByUserIdAndTaskDateBetweenAndStatus(userId, startOfWeek, endOfWeek, TaskStatus.COMPLETED)).thenReturn(3L);
        when(taskRepository.countByUserIdAndTaskDateBetweenAndStatus(userId, startOfWeek, endOfWeek, TaskStatus.PENDING)).thenReturn(4L);
        when(taskRepository.AggregateTaskActivityByDateRange(userId, startOfWeek, endOfWeek)).thenReturn(List.of());

        TaskStatisticsResponse response = statisticsService.getWeekStats();

        assertEquals(7L, response.getTotalTasks());
        assertEquals(3L, response.getCompletedTasks());
        assertEquals(4L, response.getPendingTasks());
        assertEquals(42.9, response.getCompletionRate());
        assertEquals(7, response.getBreakdown().size());
        assertTrue(response.getBreakdown().stream().allMatch(d -> d.getTotal() == 0));
    }

    @Test
    void completionRate_roundsToOneDecimalPlace() {
        LocalDate today = LocalDate.now();

        when(taskRepository.countByUserIdAndTaskDateBetween(userId, today, today)).thenReturn(3L);
        when(taskRepository.countByUserIdAndTaskDateBetweenAndStatus(userId, today, today, TaskStatus.COMPLETED)).thenReturn(1L);
        when(taskRepository.countByUserIdAndTaskDateBetweenAndStatus(userId, today, today, TaskStatus.PENDING)).thenReturn(2L);
        when(taskRepository.AggregateTaskActivityByDateRange(userId, today, today)).thenReturn(List.of());

        TaskStatisticsResponse response = statisticsService.getTodayStats();

        assertEquals(33.3, response.getCompletionRate());
    }

    @Test
    void completionRate_isZeroWhenNoTasks() {
        LocalDate today = LocalDate.now();

        when(taskRepository.countByUserIdAndTaskDateBetween(userId, today, today)).thenReturn(0L);
        when(taskRepository.countByUserIdAndTaskDateBetweenAndStatus(eq(userId), eq(today), eq(today), any(TaskStatus.class))).thenReturn(0L);
        when(taskRepository.AggregateTaskActivityByDateRange(userId, today, today)).thenReturn(List.of());

        TaskStatisticsResponse response = statisticsService.getTodayStats();

        assertEquals(0.0, response.getCompletionRate());
        assertEquals(0L, response.getTotalTasks());
    }
}
