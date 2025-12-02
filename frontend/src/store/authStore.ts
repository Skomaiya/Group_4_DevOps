import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  setUser: (u) => set({ user: u }),
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null });
  },
}));

