package com.auth.dtos.dashboard;

import com.auth.dtos.task.TaskResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {
    private LocalDate date;
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private double completionRate;
    private List<TaskResponse> todaysTasks;
    private List<TaskResponse> recentTasks;
}
