package com.auth.controllers;

import com.auth.dtos.ApiResponse;
import com.auth.dtos.analytics.AnalyticsResponse;
import com.auth.dtos.stats.TaskStatisticsResponse;
import com.auth.services.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getAnalyticsOverview() {
        AnalyticsResponse overview = analyticsService.getAnalyticsOverview();
        return ResponseEntity.ok(ApiResponse.success(overview, "Analytics overview retrieved successfully"));
    }

    @GetMapping("/weekly")
    public ResponseEntity<ApiResponse<TaskStatisticsResponse>> getWeeklyAnalytics() {
        TaskStatisticsResponse weekly = analyticsService.getWeeklyAnalytics();
        return ResponseEntity.ok(ApiResponse.success(weekly, "Weekly analytics retrieved successfully"));
    }

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<TaskStatisticsResponse>> getMonthlyAnalytics() {
        TaskStatisticsResponse monthly = analyticsService.getMonthlyAnalytics();
        return ResponseEntity.ok(ApiResponse.success(monthly, "Monthly analytics retrieved successfully"));
    }
}
