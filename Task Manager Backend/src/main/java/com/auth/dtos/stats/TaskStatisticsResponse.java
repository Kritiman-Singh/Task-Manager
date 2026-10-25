package com.auth.dtos.stats;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskStatisticsResponse {
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private double completionRate;
    private List<DailyBreakdown> breakdown;
}
