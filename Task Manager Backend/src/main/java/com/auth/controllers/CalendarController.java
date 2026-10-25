package com.auth.controllers;

import com.auth.dtos.ApiResponse;
import com.auth.dtos.calendar.CalendarDayResponse;
import com.auth.services.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/v1/calendar")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CalendarDayResponse>>> getCalendarData(
            @RequestParam(value = "month", required = false)
            @DateTimeFormat(pattern = "yyyy-MM") YearMonth month
    ) {
        List<CalendarDayResponse> calendarDays = calendarService.getCalendarMonthData(month);
        return ResponseEntity.ok(ApiResponse.success(calendarDays, "Calendar data retrieved successfully"));
    }
}
