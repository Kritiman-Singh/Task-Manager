package com.auth.services.impl;

import com.auth.dtos.analytics.AnalyticsResponse;
import com.auth.dtos.stats.TaskStatisticsResponse;
import com.auth.repositories.TaskRepository;
import com.auth.security.SecurityUtil;
import com.auth.services.AnalyticsService;
import com.auth.services.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsServiceImpl implements AnalyticsService {

    private final TaskRepository taskRepository;
    private final StatisticsService statisticsService;

    @Override
    public AnalyticsResponse getAnalyticsOverview() {
        UUID userId = SecurityUtil.getCurrentUserId();

        TaskStatisticsResponse today = statisticsService.getTodayStats();
        TaskStatisticsResponse thisWeek = statisticsService.getWeekStats();
        TaskStatisticsResponse thisMonth = statisticsService.getMonthStats();

        String mostProductiveDay = "N/A";
        List<Object[]> productiveRows = taskRepository.findMostProductiveDays(userId, PageRequest.of(0, 1));
        if (!productiveRows.isEmpty()) {
            Object[] top = productiveRows.get(0);
            LocalDate date = (LocalDate) top[0];
            long count = ((Number) top[1]).longValue();
            if (count > 0) {
                mostProductiveDay = date.getDayOfWeek().name() + " (" + date.toString() + ")";
            }
        }

        return AnalyticsResponse.builder()
                .today(today)
                .thisWeek(thisWeek)
                .thisMonth(thisMonth)
                .mostProductiveDay(mostProductiveDay)
                .weeklyProductivity(thisWeek.getBreakdown())
                .monthlyProductivity(thisMonth.getBreakdown())
                .build();
    }

    @Override
    public TaskStatisticsResponse getWeeklyAnalytics() {
        return statisticsService.getWeekStats();
    }

    @Override
    public TaskStatisticsResponse getMonthlyAnalytics() {
        return statisticsService.getMonthStats();
    }
}
