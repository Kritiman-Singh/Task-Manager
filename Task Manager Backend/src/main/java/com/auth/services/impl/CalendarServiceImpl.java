package com.auth.services.impl;

import com.auth.dtos.calendar.CalendarDayResponse;
import com.auth.repositories.TaskRepository;
import com.auth.security.SecurityUtil;
import com.auth.services.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CalendarServiceImpl implements CalendarService {

    private final TaskRepository taskRepository;

    @Override
    public List<CalendarDayResponse> getCalendarMonthData(YearMonth month) {
        UUID userId = SecurityUtil.getCurrentUserId();
        YearMonth targetMonth = (month != null) ? month : YearMonth.now();

        LocalDate firstDay = targetMonth.atDay(1);
        LocalDate lastDay = targetMonth.atEndOfMonth();

        List<Object[]> rawAggregates = taskRepository.AggregateTaskActivityByDateRange(userId, firstDay, lastDay);
        Map<LocalDate, CalendarDayResponse> dayMap = new HashMap<>();

        for (Object[] row : rawAggregates) {
            LocalDate date = (LocalDate) row[0];
            long total = ((Number) row[1]).longValue();
            long completed = ((Number) row[2]).longValue();
            long pending = ((Number) row[3]).longValue();
            double cRate = (total > 0) ? (completed * 100.0) / total : 0.0;
            cRate = Math.round(cRate * 10.0) / 10.0;

            dayMap.put(date, CalendarDayResponse.builder()
                    .date(date)
                    .totalTasks(total)
                    .completedTasks(completed)
                    .pendingTasks(pending)
                    .completionRate(cRate)
                    .build());
        }

        List<CalendarDayResponse> calendarDays = new ArrayList<>();
        for (LocalDate date = firstDay; !date.isAfter(lastDay); date = date.plusDays(1)) {
            if (dayMap.containsKey(date)) {
                calendarDays.add(dayMap.get(date));
            } else {
                calendarDays.add(CalendarDayResponse.builder()
                        .date(date)
                        .totalTasks(0)
                        .completedTasks(0)
                        .pendingTasks(0)
                        .completionRate(0.0)
                        .build());
            }
        }

        return calendarDays;
    }
}
