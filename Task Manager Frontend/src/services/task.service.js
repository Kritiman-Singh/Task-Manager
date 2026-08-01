import api from "@/utils/ApiClient";

// ─── Tasks ─────────────────────────────────────────────────────────────────

export const createTask = (payload) =>
  api.post("/tasks", payload).then((r) => r.data.data);

export const getTodaysTasks = () =>
  api.get("/tasks/today").then((r) => r.data.data);

export const getTasksByDate = (date) =>
  api.get("/tasks", { params: { date } }).then((r) => r.data.data);

export const getTasksByDateRange = (from, to) =>
  api.get("/tasks/range", { params: { from, to } }).then((r) => r.data.data);

export const searchTasks = (params) =>
  api.get("/tasks/search", { params }).then((r) => r.data.data);

export const getCompletedTasks = (params) =>
  api.get("/tasks/completed", { params }).then((r) => r.data.data);

export const getTaskById = (taskId) =>
  api.get(`/tasks/${taskId}`).then((r) => r.data.data);

export const updateTask = (taskId, payload) =>
  api.put(`/tasks/${taskId}`, payload).then((r) => r.data.data);

export const completeTask = (taskId) =>
  api.patch(`/tasks/${taskId}/complete`).then((r) => r.data.data);

export const markTaskPending = (taskId) =>
  api.patch(`/tasks/${taskId}/pending`).then((r) => r.data.data);

export const deleteTask = (taskId) =>
  api.delete(`/tasks/${taskId}`).then((r) => r.data);

// ─── Dashboard ─────────────────────────────────────────────────────────────

export const getDashboard = () =>
  api.get("/dashboard").then((r) => r.data.data);

// ─── Statistics ────────────────────────────────────────────────────────────

export const getTodayStats = () =>
  api.get("/tasks/stats/today").then((r) => r.data.data);

export const getWeekStats = () =>
  api.get("/tasks/stats/week").then((r) => r.data.data);

export const getMonthStats = () =>
  api.get("/tasks/stats/month").then((r) => r.data.data);

// ─── Calendar ──────────────────────────────────────────────────────────────

export const getCalendarData = (month) =>
  api
    .get("/calendar", { params: month ? { month } : {} })
    .then((r) => r.data.data);

// ─── Analytics ─────────────────────────────────────────────────────────────

export const getAnalyticsOverview = () =>
  api.get("/analytics/overview").then((r) => r.data.data);

export const getWeeklyAnalytics = () =>
  api.get("/analytics/weekly").then((r) => r.data.data);

export const getMonthlyAnalytics = () =>
  api.get("/analytics/monthly").then((r) => r.data.data);

// ─── User Profile ──────────────────────────────────────────────────────────

export const getUserProfile = () =>
  api.get("/users/me").then((r) => r.data.data);

export const updateUserProfile = (payload) =>
  api.put("/users/me", payload).then((r) => r.data.data);

export const changePassword = (payload) =>
  api.put("/users/me/password", payload).then((r) => r.data);
