package com.auth.controllers;

import com.auth.dtos.ApiResponse;
import com.auth.dtos.stats.TaskStatisticsResponse;
import com.auth.services.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tasks/stats")
@RequiredArgsConstructor
public class TaskStatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<TaskStatisticsResponse>> getTodayStats() {
        TaskStatisticsResponse stats = statisticsService.getTodayStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Today's statistics retrieved successfully"));
    }

    @GetMapping("/week")
    public ResponseEntity<ApiResponse<TaskStatisticsResponse>> getWeekStats() {
        TaskStatisticsResponse stats = statisticsService.getWeekStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Weekly statistics retrieved successfully"));
    }

    @GetMapping("/month")
    public ResponseEntity<ApiResponse<TaskStatisticsResponse>> getMonthStats() {
        TaskStatisticsResponse stats = statisticsService.getMonthStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Monthly statistics retrieved successfully"));
    }
}
