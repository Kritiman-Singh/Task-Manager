package com.auth.dtos.stats;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DailyBreakdown {
    private LocalDate date;
    private long total;
    private long completed;
    private long pending;
    private double completionRate;
}
