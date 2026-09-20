import { useEffect, useState, useCallback } from "react";
import { getDashboard } from "@/services/task.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TaskCard from "@/components/task/TaskCard";
import TaskFormDialog from "@/components/task/TaskFormDialog";
import { Plus, CheckCircle2, Clock, ListTodo, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

function StatCard({ icon, label, value, sub, color }) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm font-medium">{label}</p>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleTaskSaved = () => load();
  const handleTaskDeleted = () => load();
  const handleStatusChanged = () => load();

  const handleEdit = (task) => {
    setEditTask(task);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditTask(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground animate-pulse">
        Loading dashboard…
      </div>
    );
  }

  const { totalTasks = 0, completedTasks = 0, pendingTasks = 0, completionRate = 0, todaysTasks = [] } = dashboard || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Button id="btn-add-task-dashboard" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> New Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<ListTodo className="h-5 w-5 text-blue-600" />}
          label="Total Today"
          value={totalTasks}
          color="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
          label="Completed"
          value={completedTasks}
          color="bg-green-100 dark:bg-green-900/30"
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-orange-600" />}
          label="Pending"
          value={pendingTasks}
          color="bg-orange-100 dark:bg-orange-900/30"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
          label="Completion Rate"
          value={`${completionRate}%`}
          sub="Today's progress"
          color="bg-purple-100 dark:bg-purple-900/30"
        />
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Today's Progress</span>
          <span className="text-muted-foreground">{completedTasks}/{totalTasks} tasks</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="space-y-3">
        <h2 className="font-semibold text-lg">Today's Tasks</h2>
        {todaysTasks.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              <ListTodo className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No tasks for today. Add your first task!</p>
              <Button className="mt-4" onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {todaysTasks.map((task) => (
              <TaskCard
                key={task.taskId}
                task={task}
                onEdit={handleEdit}
                onDeleted={handleTaskDeleted}
                onStatusChanged={handleStatusChanged}
              />
            ))}
          </div>
        )}
      </div>

      <TaskFormDialog
        open={formOpen}
        onClose={handleFormClose}
        onSaved={handleTaskSaved}
        existingTask={editTask}
      />
    </div>
  );
}
