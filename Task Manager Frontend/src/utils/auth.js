import api from "@/utils/ApiClient";
import { create } from "zustand";

const TOKEN_KEY = "access_token";

export const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem(TOKEN_KEY),
  user: null,
  status: localStorage.getItem(TOKEN_KEY) ? "authenticating" : "anonymous",

  setAccessToken: (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    set({ accessToken: token ?? null });
  },

  setSession: ({ accessToken, user }) => {
    if (accessToken) {
      localStorage.setItem(TOKEN_KEY, accessToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    set({
      accessToken: accessToken ?? null,
      user: user ?? null,
      status: accessToken && user ? "authenticated" : "anonymous",
    });
  },

  // Called at app start to restore session when a valid access token exists.
  bootstrap: async () => {
    set({ status: "authenticating" });

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({ accessToken: null, user: null, status: "anonymous" });
      return;
    }

    set({ accessToken: token });

    try {
      const response = await api.get("/auth/me");
      set({ user: response.data, status: "authenticated" });
    } catch (e) {
      console.log("Failed to fetch current user, logging out", e);
      localStorage.removeItem(TOKEN_KEY);
      set({ accessToken: null, user: null, status: "anonymous" });
    }
  },

  login: async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    set({
      accessToken: data.accessToken,
      user: data.user,
      status: "authenticated",
    });
  },

  logout: async ({ silent } = {}) => {
    try {
      if (!silent) {
        await api.post("/auth/logout");
      }
    } catch (e) {
      console.log("Logout failed", e);
    }

    localStorage.removeItem(TOKEN_KEY);
    set({ accessToken: null, user: null, status: "anonymous" });
  },
}));
