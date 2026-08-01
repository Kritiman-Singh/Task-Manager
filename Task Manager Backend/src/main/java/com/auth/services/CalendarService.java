package com.auth.services;

import com.auth.dtos.calendar.CalendarDayResponse;

import java.time.YearMonth;
import java.util.List;

public interface CalendarService {
    List<CalendarDayResponse> getCalendarMonthData(YearMonth month);
}
