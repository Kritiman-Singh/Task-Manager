// Backend error shape:
// { success:false, message:"...", errorCode:"...", errors:{field:"msg"} }
// Axios error -> err.response.data me ye object aata hai.
const LEGACY_MESSAGE_FIX = {
  "Please put": "Password must be at least 8 characters long.",
};

export function getAuthErrorMessage(err, fallback) {
  const data = err?.response?.data;

  if (!data) {
    if (err?.code === "ECONNABORTED") return "Request timed out. Please try again.";
    if (err?.message === "Network Error") return "Cannot reach server. Check your connection and try again.";
    return fallback || "Something went wrong. Please try again.";
  }

  // 1) seedha message
  if (typeof data.message === "string" && data.message.trim()) {
    const msg = data.message.trim();
    if (LEGACY_MESSAGE_FIX[msg]) return LEGACY_MESSAGE_FIX[msg];
    return msg;
  }

  // 2) Bean-validation map: { errors: { password: "...", email: "..." } }
  if (data.errors && typeof data.errors === "object") {
    const first = Object.values(data.errors).find(
      (v) => typeof v === "string" && v.trim()
    );
    if (first) {
      const msg = first.trim();
      if (LEGACY_MESSAGE_FIX[msg]) return LEGACY_MESSAGE_FIX[msg];
      return msg;
    }
  }

  // 3) kabhi-kabhi `error` field me message aata hai
  if (typeof data.error === "string" && data.error.trim()) {
    return data.error.trim();
  }

  return fallback || "Something went wrong. Please try again.";
}
