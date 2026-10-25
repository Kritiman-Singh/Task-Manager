package com.auth.controllers;

import com.auth.dtos.ApiResponse;
import com.auth.dtos.dashboard.DashboardResponse;
import com.auth.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboardData() {
        DashboardResponse dashboardData = dashboardService.getDashboardData();
        return ResponseEntity.ok(ApiResponse.success(dashboardData, "Dashboard data retrieved successfully"));
    }
}
