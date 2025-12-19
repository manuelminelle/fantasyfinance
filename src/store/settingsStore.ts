import { create } from "zustand";

export type VolatilityLevel = "bassa" | "media" | "alta";

export type ScenarioSettings = {
  startingCash: number;
  volatility: VolatilityLevel;
  eventFrequency: number;
  recessionProbability: number;
  leverageAvailable: boolean;
  infoLagLevel: number;
};

export type SettingsSnapshot = {
  soundEnabled: boolean;
  leverageEnabled: boolean;
  blindMode: boolean;
  infoLagLevel: number;
  analyticsTier: "base" | "pro";
  scenario: ScenarioSettings;
};

type SettingsState = SettingsSnapshot & {
  initSettings: () => void;
  hydrateSettings: (snapshot: SettingsSnapshot) => void;
  resetSettings: () => void;
  setSoundEnabled: (value: boolean) => void;
  setLeverageEnabled: (value: boolean) => void;
  setBlindMode: (value: boolean) => void;
  setInfoLagLevel: (value: number) => void;
  setAnalyticsTier: (tier: "base" | "pro") => void;
  updateScenario: (partial: Partial<ScenarioSettings>) => void;
};

const SETTINGS_KEY = "marketcraft-settings";

const defaultScenario: ScenarioSettings = {
  startingCash: 10000,
  volatility: "media",
  eventFrequency: 2,
  recessionProbability: 12,
  leverageAvailable: false,
  infoLagLevel: 0,
};

const defaultState: SettingsSnapshot = {
  soundEnabled: false,
  leverageEnabled: false,
  blindMode: false,
  infoLagLevel: 0,
  analyticsTier: "base" as const,
  scenario: defaultScenario,
};

function normalizeSettingsSnapshot(snapshot: Partial<SettingsSnapshot>): SettingsSnapshot {
  const leverageEnabled = snapshot.leverageEnabled ?? defaultState.leverageEnabled;
  const infoLagLevel = snapshot.infoLagLevel ?? defaultState.infoLagLevel;
  const scenario = {
    ...defaultScenario,
    ...(snapshot.scenario ?? {}),
    leverageAvailable: leverageEnabled,
    infoLagLevel,
  };

  return {
    soundEnabled: snapshot.soundEnabled ?? defaultState.soundEnabled,
    leverageEnabled,
    blindMode: snapshot.blindMode ?? defaultState.blindMode,
    infoLagLevel,
    analyticsTier: snapshot.analyticsTier ?? defaultState.analyticsTier,
    scenario,
  };
}

function persist(state: SettingsSnapshot) {
  const payload = {
    soundEnabled: state.soundEnabled,
    leverageEnabled: state.leverageEnabled,
    blindMode: state.blindMode,
    infoLagLevel: state.infoLagLevel,
    analyticsTier: state.analyticsTier,
    scenario: state.scenario,
  };
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaultState,
  initSettings: () => {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Partial<SettingsSnapshot>;
      set(normalizeSettingsSnapshot(parsed));
    } catch {
      // ignore malformed cache
    }
  },
  hydrateSettings: (snapshot) => {
    const next = normalizeSettingsSnapshot(snapshot);
    set(next);
    persist(next);
  },
  resetSettings: () => {
    set(defaultState);
    persist(defaultState);
  },
  setSoundEnabled: (value) => {
    set({ soundEnabled: value });
    persist(get());
  },
  setLeverageEnabled: (value) => {
    set({ leverageEnabled: value, scenario: { ...get().scenario, leverageAvailable: value } });
    persist(get());
  },
  setBlindMode: (value) => {
    set({ blindMode: value });
    persist(get());
  },
  setInfoLagLevel: (value) => {
    set({ infoLagLevel: value, scenario: { ...get().scenario, infoLagLevel: value } });
    persist(get());
  },
  setAnalyticsTier: (tier) => {
    set({ analyticsTier: tier });
    persist(get());
  },
  updateScenario: (partial) => {
    set((state) => ({ scenario: { ...state.scenario, ...partial } }));
    persist(get());
  },
}));
