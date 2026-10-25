package com.auth.services;

import com.auth.dtos.analytics.AnalyticsResponse;
import com.auth.dtos.stats.TaskStatisticsResponse;

public interface AnalyticsService {
    AnalyticsResponse getAnalyticsOverview();
    TaskStatisticsResponse getWeeklyAnalytics();
    TaskStatisticsResponse getMonthlyAnalytics();
}
