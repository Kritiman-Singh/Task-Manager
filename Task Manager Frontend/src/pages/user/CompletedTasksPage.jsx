import { useEffect, useState, useCallback } from "react";
import { getCompletedTasks, markTaskPending, deleteTask } from "@/services/task.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle2, RotateCcw, Trash2 } from "lucide-react";
import { formatDate, formatInstant, priorityColor } from "@/utils/task.utils";
import toast from "react-hot-toast";

export default function CompletedTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (search.trim()) params.search = search.trim();
      const result = await getCompletedTasks(params);
      setTasks(result.content || []);
      setTotalPages(result.totalPages || 0);
    } catch {
      toast.error("Failed to load completed tasks");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleRestore = async (task) => {
    try {
      await markTaskPending(task.taskId);
      toast.success("Task restored to pending");
      load();
    } catch {
      toast.error("Failed to restore task");
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Permanently delete "${task.title}"?`)) return;
    try {
      await deleteTask(task.taskId);
      toast.success("Task deleted");
      setTasks((prev) => prev.filter((t) => t.taskId !== task.taskId));
    } catch {
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Completed Tasks</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          All tasks you've completed. Restore them to pending or delete permanently.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="completed-search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search completed tasks…"
          className="pl-8"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="h-40 flex items-center justify-center text-muted-foreground animate-pulse">Loading…</div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50 text-green-500" />
            <p>No completed tasks found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <Card key={task.taskId} className="opacity-80">
              <CardContent className="p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium line-through text-muted-foreground truncate">{task.title}</p>
                  <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                    <span>📅 {formatDate(task.taskDate)}</span>
                    {task.completedAt && (
                      <span>✅ Completed {formatInstant(task.completedAt)}</span>
                    )}
                    <span className={`px-1.5 rounded-full font-medium ${priorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    {task.category && <span className="bg-muted px-1.5 rounded-full">{task.category}</span>}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    id={`restore-${task.taskId}`}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => handleRestore(task)}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" /> Restore
                  </Button>
                  <Button
                    id={`delete-completed-${task.taskId}`}
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(task)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="py-1.5 px-3 text-sm text-muted-foreground">Page {page + 1} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
