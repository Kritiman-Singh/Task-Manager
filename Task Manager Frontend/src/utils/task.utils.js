import { format } from "date-fns";

/**
 * Format a LocalDate string (YYYY-MM-DD) for display
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr + "T00:00:00"), "dd MMM yyyy");
  } catch {
    return dateStr;
  }
};

/**
 * Format a LocalTime string (HH:mm:ss) for display
 */
export const formatTime = (timeStr) => {
  if (!timeStr) return "—";
  const [hh, mm] = timeStr.split(":");
  const h = parseInt(hh, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${mm} ${ampm}`;
};

/**
 * Format an Instant ISO string for display
 */
export const formatInstant = (isoStr) => {
  if (!isoStr) return "—";
  try {
    return format(new Date(isoStr), "dd MMM yyyy, HH:mm");
  } catch {
    return isoStr;
  }
};

/**
 * Return color class based on priority
 */
export const priorityColor = (priority) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "LOW":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    default:
      return "bg-muted text-muted-foreground";
  }
};

/**
 * Return badge variant based on status
 */
export const statusVariant = (status) => {
  return status === "COMPLETED" ? "default" : "secondary";
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const todayDate = () => format(new Date(), "yyyy-MM-dd");

/**
 * Get current year-month in YYYY-MM format
 */
export const currentMonth = () => format(new Date(), "yyyy-MM");
