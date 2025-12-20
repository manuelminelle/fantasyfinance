import { create } from "zustand";

export type ThemeMode = "light" | "dark";

type UiState = {
  theme: ThemeMode;
  sidebarCollapsed: boolean;
  onboardingOpen: boolean;
  onboardingStep: number;
  displayName: string | null;
  initTheme: () => void;
  initOnboarding: () => void;
  initProfile: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setDisplayName: (name: string) => void;
  nextOnboarding: () => void;
  prevOnboarding: () => void;
  skipOnboarding: () => void;
  openOnboarding: () => void;
};

const THEME_KEY = "marketcraft-theme";
const ONBOARDING_KEY = "marketcraft-onboarding";
const PROFILE_NAME_KEY = "marketcraft-profile-name";

export const useUiStore = create<UiState>((set, get) => ({
  theme: "dark",
  sidebarCollapsed: false,
  onboardingOpen: false,
  onboardingStep: 0,
  displayName: null,
  initTheme: () => {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") {
      set({ theme: stored });
    }
  },
  initOnboarding: () => {
    const completed = window.localStorage.getItem(ONBOARDING_KEY) === "done";
    if (!completed) {
      set({ onboardingOpen: true, onboardingStep: 0 });
    }
  },
  initProfile: () => {
    const stored = window.localStorage.getItem(PROFILE_NAME_KEY);
    if (stored) {
      set({ displayName: stored });
    }
  },
  setTheme: (theme) => {
    window.localStorage.setItem(THEME_KEY, theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(THEME_KEY, next);
    set({ theme: next });
  },
  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },
  setDisplayName: (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    window.localStorage.setItem(PROFILE_NAME_KEY, trimmed);
    set({ displayName: trimmed });
  },
  nextOnboarding: () => {
    set((state) => {
      if (state.onboardingStep >= 4) {
        window.localStorage.setItem(ONBOARDING_KEY, "done");
        return { onboardingOpen: false };
      }
      return { onboardingStep: state.onboardingStep + 1 };
    });
  },
  prevOnboarding: () => {
    set((state) => ({ onboardingStep: Math.max(state.onboardingStep - 1, 0) }));
  },
  skipOnboarding: () => {
    window.localStorage.setItem(ONBOARDING_KEY, "done");
    set({ onboardingOpen: false });
  },
  openOnboarding: () => {
    window.localStorage.removeItem(ONBOARDING_KEY);
    set({ onboardingOpen: true, onboardingStep: 0 });
  },
}));
