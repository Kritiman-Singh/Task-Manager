import { useEffect, useState, useCallback } from "react";
import { searchTasks } from "@/services/task.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import TaskCard from "@/components/task/TaskCard";
import TaskFormDialog from "@/components/task/TaskFormDialog";
import { Plus, Search, ListTodo } from "lucide-react";
import toast from "react-hot-toast";

const PRIORITIES = ["", "LOW", "MEDIUM", "HIGH"];
const STATUSES = ["", "PENDING", "COMPLETED"];

export default function MyTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filters, setFilters] = useState({
    search: "", status: "", priority: "", category: "",
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 10, ...filters };
      // Remove empty filters
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const result = await searchTasks(params);
      setTasks(result.content || []);
      setTotalPages(result.totalPages || 0);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { load(); }, [load]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditTask(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage and track all your tasks</p>
        </div>
        <Button id="btn-add-task-mytasks" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search tasks…"
            className="pl-8"
          />
        </div>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          id="filter-status"
        >
          <option value="">All Status</option>
          {STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
          ))}
        </select>
        <select
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          id="filter-priority"
        >
          <option value="">All Priority</option>
          {PRIORITIES.filter(Boolean).map((p) => (
            <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
          ))}
        </select>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground animate-pulse">
          Loading tasks…
        </div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            <ListTodo className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No tasks found. Try adjusting filters or create a new task.</p>
            <Button className="mt-4" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.taskId}
              task={task}
              onEdit={handleEdit}
              onDeleted={(id) => setTasks((prev) => prev.filter((t) => t.taskId !== id))}
              onStatusChanged={(updated) => setTasks((prev) => prev.map((t) => t.taskId === updated.taskId ? updated : t))}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="py-1.5 px-3 text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}

      <TaskFormDialog
        open={formOpen}
        onClose={handleFormClose}
        onSaved={load}
        existingTask={editTask}
      />
    </div>
  );
}
