package com.auth.services.impl;

import com.auth.dtos.stats.DailyBreakdown;
import com.auth.dtos.stats.TaskStatisticsResponse;
import com.auth.enums.TaskStatus;
import com.auth.repositories.TaskRepository;
import com.auth.security.SecurityUtil;
import com.auth.services.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatisticsServiceImpl implements StatisticsService {

    private final TaskRepository taskRepository;

    @Override
    public TaskStatisticsResponse getTodayStats() {
        UUID userId = SecurityUtil.getCurrentUserId();
        LocalDate today = LocalDate.now();
        return calculateStatsForRange(userId, today, today);
    }

    @Override
    public TaskStatisticsResponse getWeekStats() {
        UUID userId = SecurityUtil.getCurrentUserId();
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        return calculateStatsForRange(userId, startOfWeek, endOfWeek);
    }

    @Override
    public TaskStatisticsResponse getMonthStats() {
        UUID userId = SecurityUtil.getCurrentUserId();
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endOfMonth = today.with(TemporalAdjusters.lastDayOfMonth());
        return calculateStatsForRange(userId, startOfMonth, endOfMonth);
    }

    public TaskStatisticsResponse calculateStatsForRange(UUID userId, LocalDate from, LocalDate to) {
        long totalTasks = taskRepository.countByUserIdAndTaskDateBetween(userId, from, to);
        long completedTasks = taskRepository.countByUserIdAndTaskDateBetweenAndStatus(userId, from, to, TaskStatus.COMPLETED);
        long pendingTasks = taskRepository.countByUserIdAndTaskDateBetweenAndStatus(userId, from, to, TaskStatus.PENDING);

        double rate = (totalTasks > 0) ? (completedTasks * 100.0) / totalTasks : 0.0;
        double completionRate = Math.round(rate * 10.0) / 10.0;

        List<Object[]> rawAggregates = taskRepository.AggregateTaskActivityByDateRange(userId, from, to);
        Map<LocalDate, DailyBreakdown> breakdownMap = new HashMap<>();

        for (Object[] row : rawAggregates) {
            LocalDate date = (LocalDate) row[0];
            long total = ((Number) row[1]).longValue();
            long completed = ((Number) row[2]).longValue();
            long pending = ((Number) row[3]).longValue();
            double cRate = (total > 0) ? (completed * 100.0) / total : 0.0;
            cRate = Math.round(cRate * 10.0) / 10.0;

            breakdownMap.put(date, DailyBreakdown.builder()
                    .date(date)
                    .total(total)
                    .completed(completed)
                    .pending(pending)
                    .completionRate(cRate)
                    .build());
        }

        List<DailyBreakdown> breakdown = new ArrayList<>();
        for (LocalDate date = from; !date.isAfter(to); date = date.plusDays(1)) {
            if (breakdownMap.containsKey(date)) {
                breakdown.add(breakdownMap.get(date));
            } else {
                breakdown.add(DailyBreakdown.builder()
                        .date(date)
                        .total(0)
                        .completed(0)
                        .pending(0)
                        .completionRate(0.0)
                        .build());
            }
        }

        return TaskStatisticsResponse.builder()
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .pendingTasks(pendingTasks)
                .completionRate(completionRate)
                .breakdown(breakdown)
                .build();
    }
}
