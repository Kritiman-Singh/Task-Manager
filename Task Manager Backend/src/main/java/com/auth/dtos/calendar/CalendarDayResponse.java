package com.auth.dtos.calendar;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CalendarDayResponse {
    private LocalDate date;
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private double completionRate;
}
