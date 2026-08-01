package com.auth.services;

import com.auth.dtos.stats.TaskStatisticsResponse;

public interface StatisticsService {
    TaskStatisticsResponse getTodayStats();
    TaskStatisticsResponse getWeekStats();
    TaskStatisticsResponse getMonthStats();
}
