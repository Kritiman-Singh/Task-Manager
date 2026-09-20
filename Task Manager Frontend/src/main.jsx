import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { LoginPage } from "./pages/login.page.jsx";
import RegisterPage from "./pages/register.page";
import AppLayout from "./pages/app.layout";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import OAuthSuccessPage from "./pages/oauth-success.page";
import HomePage from "./pages/HomePage";

// Task management pages
import TaskLayout from "./pages/user/TaskLayout";
import DashboardPage from "./pages/user/DashboardPage";
import MyTasksPage from "./pages/user/MyTasksPage";
import CalendarPage from "./pages/user/CalendarPage";
import CompletedTasksPage from "./pages/user/CompletedTasksPage";
import AnalyticsPage from "./pages/user/AnalyticsPage";
import SettingsPage from "./pages/user/SettingsPage";

// Auth guard
import { useAuthStore } from "./utils/auth";

// eslint-disable-next-line react-refresh/only-export-components
function ProtectedRoute({ children }) {
  const status = useAuthStore((s) => s.status);
  if (status === "authenticating") {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground animate-pulse">
        Authenticating…
      </div>
    );
  }
  if (status !== "authenticated") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

createRoot(document.getElementById("root")).render(
  <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth/success" element={<OAuthSuccessPage />} />
          <Route path="/auth/success" element={<OAuthSuccessPage />} />

          {/* Protected TaskFlow Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <TaskLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="tasks" element={<MyTasksPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="completed" element={<CompletedTasksPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);
