import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("Streamly-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("Streamly-theme", theme);
    set({ theme });
  },
}));