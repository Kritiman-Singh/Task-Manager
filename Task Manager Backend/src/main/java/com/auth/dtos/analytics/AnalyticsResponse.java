package com.auth.dtos.analytics;

import com.auth.dtos.stats.DailyBreakdown;
import com.auth.dtos.stats.TaskStatisticsResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsResponse {
    private TaskStatisticsResponse today;
    private TaskStatisticsResponse thisWeek;
    private TaskStatisticsResponse thisMonth;
    private String mostProductiveDay;
    private List<DailyBreakdown> weeklyProductivity;
    private List<DailyBreakdown> monthlyProductivity;
}
