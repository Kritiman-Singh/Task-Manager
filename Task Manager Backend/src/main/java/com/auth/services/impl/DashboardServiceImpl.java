package com.auth.services.impl;

import com.auth.dtos.dashboard.DashboardResponse;
import com.auth.dtos.task.TaskResponse;
import com.auth.enums.TaskStatus;
import com.auth.repositories.TaskRepository;
import com.auth.security.SecurityUtil;
import com.auth.services.DashboardService;
import com.auth.services.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final TaskRepository taskRepository;
    private final TaskService taskService;

    @Override
    public DashboardResponse getDashboardData() {
        UUID userId = SecurityUtil.getCurrentUserId();
        LocalDate today = LocalDate.now();

        long totalTasks = taskRepository.countByUserIdAndTaskDate(userId, today);
        long completedTasks = taskRepository.countByUserIdAndTaskDateAndStatus(userId, today, TaskStatus.COMPLETED);
        long pendingTasks = taskRepository.countByUserIdAndTaskDateAndStatus(userId, today, TaskStatus.PENDING);

        double completionRate = (totalTasks > 0) ? (completedTasks * 100.0) / totalTasks : 0.0;
        completionRate = Math.round(completionRate * 10.0) / 10.0;

        List<TaskResponse> todaysTasks = taskService.getTodaysTasks();

        return DashboardResponse.builder()
                .date(today)
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .pendingTasks(pendingTasks)
                .completionRate(completionRate)
                .todaysTasks(todaysTasks)
                .recentTasks(todaysTasks)
                .build();
    }
}
