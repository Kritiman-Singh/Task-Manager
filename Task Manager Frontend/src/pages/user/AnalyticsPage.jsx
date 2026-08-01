import { useEffect, useState, useCallback } from "react";
import { getAnalyticsOverview } from "@/services/task.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, TrendingUp, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";

function StatCard({ icon, label, value, sub, color }) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm font-medium">{label}</p>
          {sub !== undefined && (
            <p className="text-xs text-muted-foreground">{sub}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function BreakdownBar({ breakdown = [] }) {
  const max = Math.max(...breakdown.map((d) => d.total), 1);
  return (
    <div className="space-y-2">
      {breakdown.map((d) => (
        <div key={d.date} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-20 shrink-0">
            {format(parseISO(d.date), "dd MMM")}
          </span>
          <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
              style={{ width: `${(d.completed / max) * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-16 text-right shrink-0">
            {d.completed}/{d.total}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAnalyticsOverview();
      setAnalytics(data);
    } catch {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground animate-pulse">
        Loading analytics…
      </div>
    );
  }

  const { today, thisWeek, thisMonth, mostProductiveDay, weeklyProductivity = [], monthlyProductivity = [] } = analytics || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Your task productivity insights</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
          label="Today Completed"
          value={today?.completedTasks ?? 0}
          sub={`of ${today?.totalTasks ?? 0} tasks`}
          color="bg-green-100 dark:bg-green-900/30"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
          label="This Week"
          value={`${thisWeek?.completionRate ?? 0}%`}
          sub={`${thisWeek?.completedTasks ?? 0}/${thisWeek?.totalTasks ?? 0} completed`}
          color="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-orange-600" />}
          label="This Month"
          value={`${thisMonth?.completionRate ?? 0}%`}
          sub={`${thisMonth?.completedTasks ?? 0}/${thisMonth?.totalTasks ?? 0} completed`}
          color="bg-orange-100 dark:bg-orange-900/30"
        />
        <StatCard
          icon={<Trophy className="h-5 w-5 text-purple-600" />}
          label="Most Productive"
          value={mostProductiveDay?.split(" ")[0] ?? "N/A"}
          sub={mostProductiveDay?.includes("(") ? mostProductiveDay.match(/\(([^)]+)\)/)?.[1] : ""}
          color="bg-purple-100 dark:bg-purple-900/30"
        />
      </div>

      {/* Weekly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Productivity</CardTitle>
        </CardHeader>
        <CardContent>
          {weeklyProductivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data for this week yet.</p>
          ) : (
            <BreakdownBar breakdown={weeklyProductivity} />
          )}
        </CardContent>
      </Card>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Productivity</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyProductivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data for this month yet.</p>
          ) : (
            <BreakdownBar breakdown={monthlyProductivity} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
