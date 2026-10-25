import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { completeTask, markTaskPending, deleteTask } from "@/services/task.service";
import { formatDate, formatTime, priorityColor, statusVariant } from "@/utils/task.utils";
import { CheckCircle2, Circle, Pencil, Trash2, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function TaskCard({ task, onEdit, onDeleted, onStatusChanged }) {
  const isCompleted = task.status === "COMPLETED";

  const handleToggle = async () => {
    try {
      const updated = isCompleted
        ? await markTaskPending(task.taskId)
        : await completeTask(task.taskId);
      onStatusChanged?.(updated);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update task status");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    try {
      await deleteTask(task.taskId);
      toast.success("Task deleted");
      onDeleted?.(task.taskId);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete task");
    }
  };

  return (
    <Card className={`transition-all ${isCompleted ? "opacity-70" : ""}`}>
      <CardContent className="p-4 flex items-start gap-3">
        <button
          id={`task-toggle-${task.taskId}`}
          onClick={handleToggle}
          className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
          aria-label={isCompleted ? "Mark pending" : "Mark complete"}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`font-medium truncate ${isCompleted ? "line-through text-muted-foreground" : ""}`}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="text-sm text-muted-foreground truncate mt-0.5">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-2 items-center text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(task.taskDate)}
              {task.startTime && ` · ${formatTime(task.startTime)}`}
              {task.dueTime && ` – ${formatTime(task.dueTime)}`}
            </span>
            <Badge variant={statusVariant(task.status)} className="text-xs px-1.5 py-0">
              {task.status}
            </Badge>
            <span className={`px-1.5 py-0 rounded-full text-xs font-medium ${priorityColor(task.priority)}`}>
              {task.priority}
            </span>
            {task.category && (
              <span className="bg-muted px-1.5 py-0 rounded-full">{task.category}</span>
            )}
          </div>
        </div>

        <div className="flex gap-1 shrink-0">
          {!isCompleted && (
            <Button
              id={`task-edit-${task.taskId}`}
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit?.(task)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            id={`task-delete-${task.taskId}`}
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
