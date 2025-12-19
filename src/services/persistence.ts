import { signInAnonymously } from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useGameStore } from "../store/gameStore";
import { useSettingsStore, type SettingsSnapshot } from "../store/settingsStore";
import type { GameState } from "../types/engine";
import { initFirebaseServices } from "./firebase";

const LOCAL_SAVE_KEY = "marketcraft-save-v1";
const LOCAL_SAVE_VERSION = 1;
const LOCAL_SAVE_DEBOUNCE_MS = 800;
const CLOUD_SAVE_DEBOUNCE_MS = 3500;

export type SaveSnapshot = {
  version: number;
  savedAt: number;
  game: GameState;
  settings: SettingsSnapshot;
};

type CloudSaveDoc = {
  gameVersion: string;
  lastUpdated: number;
  settings: SettingsSnapshot;
  currentGameState: GameState;
  lastLocalHash: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

function hashSnapshot(snapshot: SaveSnapshot) {
  return hashString(JSON.stringify({ game: snapshot.game, settings: snapshot.settings }));
}

function buildSnapshot(game: GameState, settings: SettingsSnapshot, savedAt = Date.now()): SaveSnapshot {
  return {
    version: LOCAL_SAVE_VERSION,
    savedAt,
    game,
    settings,
  };
}

function pickSettingsSnapshot(state: ReturnType<typeof useSettingsStore.getState>): SettingsSnapshot {
  return {
    soundEnabled: state.soundEnabled,
    leverageEnabled: state.leverageEnabled,
    blindMode: state.blindMode,
    infoLagLevel: state.infoLagLevel,
    analyticsTier: state.analyticsTier,
    scenario: state.scenario,
  };
}

export function createSnapshotFromState(): SaveSnapshot {
  const game = useGameStore.getState().game;
  const settings = pickSettingsSnapshot(useSettingsStore.getState());
  return buildSnapshot(game, settings);
}

function parseSnapshot(raw: string): SaveSnapshot | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) return null;
    if (!isRecord(parsed.game) || !isRecord(parsed.settings)) return null;

    const version = typeof parsed.version === "number" ? parsed.version : LOCAL_SAVE_VERSION;
    const savedAt = typeof parsed.savedAt === "number" ? parsed.savedAt : Date.now();

    return {
      version,
      savedAt,
      game: parsed.game as GameState,
      settings: parsed.settings as SettingsSnapshot,
    };
  } catch {
    return null;
  }
}

export function loadLocalSave(): SaveSnapshot | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(LOCAL_SAVE_KEY);
  if (!raw) return null;
  return parseSnapshot(raw);
}

export function saveLocalSnapshot(snapshot: SaveSnapshot) {
  if (!isBrowser()) return;
  window.localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(snapshot));
}

export function clearLocalSave() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(LOCAL_SAVE_KEY);
}

export function applySnapshot(snapshot: SaveSnapshot) {
  useSettingsStore.getState().hydrateSettings(snapshot.settings);
  useGameStore.getState().hydrateGame(snapshot.game);
}

export function downloadSnapshot(snapshot: SaveSnapshot) {
  if (typeof document === "undefined") return;
  const payload = JSON.stringify(snapshot, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `marketcraft-save-${new Date(snapshot.savedAt).toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function readSnapshotFile(file: File): Promise<SaveSnapshot> {
  const text = await file.text();
  const parsed = parseSnapshot(text);
  if (!parsed) {
    throw new Error("Formato salvataggio non valido.");
  }
  return parsed;
}

function toCloudSnapshot(data: CloudSaveDoc): SaveSnapshot | null {
  if (!data || !data.currentGameState || !data.settings) return null;
  return buildSnapshot(data.currentGameState, data.settings, data.lastUpdated || Date.now());
}

type CloudSyncHandle = {
  enabled: boolean;
  queueSnapshot: (snapshot: SaveSnapshot) => void;
  resetRemote: () => Promise<void>;
  stop: () => void;
};

function initCloudSync(localSnapshot: SaveSnapshot | null): CloudSyncHandle {
  const services = initFirebaseServices();
  if (!services) {
    return {
      enabled: false,
      queueSnapshot: () => {},
      resetRemote: async () => {},
      stop: () => {},
    };
  }

  const { auth, db } = services;
  let active = true;
  let userId: string | null = null;
  let pendingSnapshot: SaveSnapshot | null = null;
  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  let lastCloudHash = "";

  const scheduleSave = () => {
    if (!pendingSnapshot || !active || !userId) return;
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      void flushPending();
    }, CLOUD_SAVE_DEBOUNCE_MS);
  };

  const flushPending = async () => {
    if (!pendingSnapshot || !active || !userId) return;
    const snapshot = pendingSnapshot;
    pendingSnapshot = null;

    const nextHash = hashSnapshot(snapshot);
    if (nextHash === lastCloudHash) return;

    try {
      await setDoc(
        doc(db, "users", userId),
        {
          gameVersion: snapshot.game.gameVersion,
          lastUpdated: snapshot.savedAt,
          settings: snapshot.settings,
          currentGameState: snapshot.game,
          lastLocalHash: nextHash,
        },
        { merge: true }
      );
      lastCloudHash = nextHash;
    } catch {
      pendingSnapshot = snapshot;
    }
  };

  const queueSnapshot = (snapshot: SaveSnapshot) => {
    pendingSnapshot = snapshot;
    if (!userId) return;
    scheduleSave();
  };

  const ensureUser = async () => {
    if (auth.currentUser) return auth.currentUser;
    const result = await signInAnonymously(auth);
    return result.user;
  };

  const bootstrap = async () => {
    try {
      const user = await ensureUser();
      if (!active) return;
      userId = user.uid;

      const ref = doc(db, "users", userId);
      const snap = await getDoc(ref);
      if (!active) return;

      if (snap.exists()) {
        const data = snap.data() as CloudSaveDoc;
        const cloudSnapshot = toCloudSnapshot(data);
        if (cloudSnapshot) {
          lastCloudHash = data.lastLocalHash || hashSnapshot(cloudSnapshot);
          const localUpdatedAt = localSnapshot?.savedAt ?? 0;
          if (cloudSnapshot.savedAt > localUpdatedAt) {
            applySnapshot(cloudSnapshot);
            saveLocalSnapshot(cloudSnapshot);
          } else if (localSnapshot && localUpdatedAt > cloudSnapshot.savedAt) {
            pendingSnapshot = localSnapshot;
            scheduleSave();
          }
        }
      } else if (localSnapshot) {
        pendingSnapshot = localSnapshot;
        scheduleSave();
      }
    } catch {
      // ignore cloud init failures
    }
  };

  void bootstrap();

  return {
    enabled: true,
    queueSnapshot,
    resetRemote: async () => {
      if (!userId) return;
      await deleteDoc(doc(db, "users", userId));
    },
    stop: () => {
      active = false;
      if (saveTimer) clearTimeout(saveTimer);
    },
  };
}

export function startLocalAutosave(onSnapshot?: (snapshot: SaveSnapshot) => void) {
  if (!isBrowser()) return () => {};

  let timer: ReturnType<typeof setTimeout> | null = null;
  const schedule = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const snapshot = createSnapshotFromState();
      saveLocalSnapshot(snapshot);
      onSnapshot?.(snapshot);
      timer = null;
    }, LOCAL_SAVE_DEBOUNCE_MS);
  };

  const unsubscribeGame = useGameStore.subscribe(schedule);
  const unsubscribeSettings = useSettingsStore.subscribe(schedule);

  return () => {
    unsubscribeGame();
    unsubscribeSettings();
    if (timer) clearTimeout(timer);
  };
}

export function startPersistence() {
  const localSnapshot = loadLocalSave();
  if (localSnapshot) {
    applySnapshot(localSnapshot);
  }

  const cloudSync = initCloudSync(localSnapshot);
  const stopAutosave = startLocalAutosave((snapshot) => {
    cloudSync.queueSnapshot(snapshot);
  });

  return () => {
    stopAutosave();
    cloudSync.stop();
  };
}

export async function resetAccount() {
  clearLocalSave();
  useGameStore.getState().resetGame();
  useSettingsStore.getState().resetSettings();

  const services = initFirebaseServices();
  if (!services) return;

  const { auth, db } = services;
  const user = auth.currentUser ?? (await signInAnonymously(auth)).user;
  await deleteDoc(doc(db, "users", user.uid));
}

export function getLocalSaveInfo() {
  const snapshot = loadLocalSave();
  if (!snapshot) return null;
  return {
    savedAt: snapshot.savedAt,
    version: snapshot.version,
    gameVersion: snapshot.game.gameVersion,
    week: snapshot.game.week,
  };
}
