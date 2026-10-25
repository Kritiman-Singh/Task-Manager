import { useEffect, useState, useCallback } from "react";
import { getCalendarData, getTasksByDate } from "@/services/task.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TaskCard from "@/components/task/TaskCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";

function getMonthLabel(year, month) {
  return new Date(year, month - 1, 1).toLocaleString("en-IN", { month: "long", year: "numeric" });
}

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [calDays, setCalDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(today, "yyyy-MM-dd"));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCalendar = useCallback(async () => {
    setLoading(true);
    try {
      const monthStr = `${year}-${String(month).padStart(2, "0")}`;
      const data = await getCalendarData(monthStr);
      setCalDays(data || []);
    } catch {
      toast.error("Failed to load calendar");
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  const loadTasksForDate = useCallback(async (date) => {
    try {
      const data = await getTasksByDate(date);
      setTasks(data || []);
    } catch {
      toast.error("Failed to load tasks for selected date");
    }
  }, []);

  useEffect(() => { loadCalendar(); }, [loadCalendar]);
  useEffect(() => { if (selectedDate) loadTasksForDate(selectedDate); }, [selectedDate, loadTasksForDate]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  // Build grid
  const firstOf = new Date(year, month - 1, 1);
  const startDow = (firstOf.getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month, 0).getDate();
  const dayMap = {};
  calDays.forEach((d) => { dayMap[d.date] = d; });
  const gridCells = [];
  for (let i = 0; i < startDow; i++) gridCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    gridCells.push({ day: d, dateStr, info: dayMap[dateStr] });
  }
  while (gridCells.length % 7 !== 0) gridCells.push(null);

  const getCellColor = (info) => {
    if (!info || info.totalTasks === 0) return "";
    const rate = info.completionRate;
    if (rate === 100) return "bg-green-100 dark:bg-green-900/30";
    if (rate >= 50) return "bg-yellow-100 dark:bg-yellow-900/30";
    return "bg-orange-100 dark:bg-orange-900/30";
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground text-sm mt-0.5">View and manage tasks by date</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        {/* Calendar Grid */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{getMonthLabel(year, month)}</CardTitle>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth} id="btn-prev-month">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth} id="btn-next-month">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            {/* Day-of-week header */}
            <div className="grid grid-cols-7 mb-1">
              {DOW.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
              ))}
            </div>
            {/* Grid rows */}
            {loading ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground animate-pulse">Loading…</div>
            ) : (
              <div className="grid grid-cols-7 gap-0.5">
                {gridCells.map((cell, idx) => {
                  if (!cell) return <div key={`empty-${idx}`} />;
                  const isToday = cell.dateStr === format(today, "yyyy-MM-dd");
                  const isSelected = cell.dateStr === selectedDate;
                  return (
                    <button
                      key={cell.dateStr}
                      id={`cal-day-${cell.dateStr}`}
                      onClick={() => setSelectedDate(cell.dateStr)}
                      className={[
                        "relative p-1.5 rounded-lg text-sm transition-all flex flex-col items-center",
                        isSelected ? "ring-2 ring-primary bg-primary/10" : "hover:bg-muted",
                        isToday && !isSelected ? "font-bold text-primary" : "",
                        getCellColor(cell.info),
                      ].filter(Boolean).join(" ")}
                    >
                      <span>{cell.day}</span>
                      {cell.info && cell.info.totalTasks > 0 && (
                        <span className="text-[9px] text-muted-foreground">{cell.info.totalTasks}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tasks for selected date */}
        <div className="space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            {selectedDate
              ? format(parseISO(selectedDate), "EEEE, dd MMM yyyy")
              : "Select a date"}
          </h2>
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground text-sm">
                No tasks for this date.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskCard
                  key={task.taskId}
                  task={task}
                  onStatusChanged={(updated) =>
                    setTasks((prev) => prev.map((t) => t.taskId === updated.taskId ? updated : t))
                  }
                  onDeleted={(id) =>
                    setTasks((prev) => prev.filter((t) => t.taskId !== id))
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
