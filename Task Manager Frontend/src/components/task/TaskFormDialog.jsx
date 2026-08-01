import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTask, updateTask } from "@/services/task.service";
import toast from "react-hot-toast";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
const CATEGORIES = ["Work", "Personal", "Health", "Study", "Finance", "Shopping", "Other"];

export default function TaskFormDialog({ open, onClose, onSaved, existingTask }) {
  const isEdit = !!existingTask;

  const [form, setForm] = useState({
    title: "",
    description: "",
    taskDate: new Date().toISOString().slice(0, 10),
    startTime: "",
    dueTime: "",
    priority: "MEDIUM",
    category: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingTask) {
      setForm({
        title: existingTask.title || "",
        description: existingTask.description || "",
        taskDate: existingTask.taskDate || new Date().toISOString().slice(0, 10),
        startTime: existingTask.startTime || "",
        dueTime: existingTask.dueTime || "",
        priority: existingTask.priority || "MEDIUM",
        category: existingTask.category || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        taskDate: new Date().toISOString().slice(0, 10),
        startTime: "",
        dueTime: "",
        priority: "MEDIUM",
        category: "",
      });
    }
  }, [existingTask, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.taskDate) {
      toast.error("Task date is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        taskDate: form.taskDate,
        startTime: form.startTime || null,
        dueTime: form.dueTime || null,
        priority: form.priority,
        category: form.category.trim() || null,
      };

      let saved;
      if (isEdit) {
        saved = await updateTask(existingTask.taskId, payload);
        toast.success("Task updated successfully");
      } else {
        saved = await createTask(payload);
        toast.success("Task created successfully");
      }
      onSaved(saved);
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to save task";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="task-title">Title *</Label>
            <Input
              id="task-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional description"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="task-date">Date *</Label>
              <Input
                id="task-date"
                name="taskDate"
                type="date"
                value={form.taskDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="task-start">Start Time</Label>
              <Input
                id="task-start"
                name="startTime"
                type="time"
                value={form.startTime}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="task-due">Due Time</Label>
              <Input
                id="task-due"
                name="dueTime"
                type="time"
                value={form.dueTime}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="task-priority">Priority</Label>
              <select
                id="task-priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="task-category">Category</Label>
              <select
                id="task-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">None</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
