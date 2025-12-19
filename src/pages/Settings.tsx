import { useEffect, useRef, useState, type ChangeEvent } from "react";
import GlassCard from "../components/ui/GlassCard";
import ThemeToggle from "../components/ui/ThemeToggle";
import Switch from "../components/ui/Switch";
import PageTransition from "../components/layout/PageTransition";
import { useSettingsStore } from "../store/settingsStore";
import { useUiStore } from "../store/uiStore";
import {
  applySnapshot,
  createSnapshotFromState,
  downloadSnapshot,
  getLocalSaveInfo,
  readSnapshotFile,
  resetAccount,
  saveLocalSnapshot,
} from "../services/persistence";
import { isFirebaseConfigured } from "../services/firebase";

export default function Settings() {
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const leverageEnabled = useSettingsStore((state) => state.leverageEnabled);
  const blindMode = useSettingsStore((state) => state.blindMode);
  const infoLagLevel = useSettingsStore((state) => state.infoLagLevel);
  const analyticsTier = useSettingsStore((state) => state.analyticsTier);
  const setSoundEnabled = useSettingsStore((state) => state.setSoundEnabled);
  const setLeverageEnabled = useSettingsStore((state) => state.setLeverageEnabled);
  const setBlindMode = useSettingsStore((state) => state.setBlindMode);
  const setInfoLagLevel = useSettingsStore((state) => state.setInfoLagLevel);
  const setAnalyticsTier = useSettingsStore((state) => state.setAnalyticsTier);

  const openOnboarding = useUiStore((state) => state.openOnboarding);
  const [saveInfo, setSaveInfo] = useState(() => getLocalSaveInfo());
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cloudEnabled = isFirebaseConfigured();

  useEffect(() => {
    setSaveInfo(getLocalSaveInfo());
  }, []);

  const handleExport = () => {
    const snapshot = createSnapshotFromState();
    saveLocalSnapshot(snapshot);
    downloadSnapshot(snapshot);
    setSaveInfo(getLocalSaveInfo());
    setSaveMessage("Backup esportato con successo.");
    setSaveError(null);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const snapshot = await readSnapshotFile(file);
      const nextSnapshot = {
        ...snapshot,
        savedAt: Date.now(),
      };
      applySnapshot(nextSnapshot);
      saveLocalSnapshot(nextSnapshot);
      setSaveInfo(getLocalSaveInfo());
      setSaveMessage("Backup importato e applicato.");
      setSaveError(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Impossibile importare il backup.");
      setSaveMessage(null);
    } finally {
      event.target.value = "";
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Vuoi davvero resettare l'account? L'operazione cancella i salvataggi locali e cloud."
    );
    if (!confirmed) return;
    await resetAccount();
    setSaveInfo(getLocalSaveInfo());
    setSaveMessage("Account resettato.");
    setSaveError(null);
  };

  return (
    <PageTransition>
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard title="Preferenze" subtitle="Tema, audio e accessibilita">
          <div className="flex flex-col gap-4">
            <ThemeToggle />
            <Switch
              checked={soundEnabled}
              onChange={() => setSoundEnabled(!soundEnabled)}
              label="Audio premium"
              description="Attiva effetti sonori discreti per conferme e notifiche."
            />
            <div className="rounded-2xl border border-border/60 bg-surface/70 px-4 py-3 text-sm">
              <p className="font-semibold text-text">Livello info lag</p>
              <p className="text-xs text-muted">Riduce la precisione dei report in modalita cieca.</p>
              <input
                type="range"
                min={0}
                max={3}
                value={infoLagLevel}
                onChange={(event) => setInfoLagLevel(Number(event.target.value))}
                className="mt-3 w-full"
              />
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>0</span>
                <span>3</span>
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-surface/70 px-4 py-3 text-sm">
              <p className="font-semibold text-text">Livello analisi</p>
              <div className="mt-3 flex gap-2">
                {["base", "pro"].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setAnalyticsTier(tier as "base" | "pro")}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      analyticsTier === tier
                        ? "bg-accent/80 text-white"
                        : "bg-surface/80 text-muted"
                    }`}
                  >
                    {tier === "base" ? "Base" : "Pro"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Salvataggi" subtitle="Backup locale e cloud">
          <div className="flex flex-col gap-4 text-sm">
            <div className="rounded-2xl border border-border/60 bg-surface/70 px-4 py-3">
              <p className="font-semibold text-text">Cache locale</p>
              <p className="text-xs text-muted">
                {saveInfo
                  ? `Ultimo salvataggio: ${new Date(saveInfo.savedAt).toLocaleString("it-IT")} · Settimana ${saveInfo.week}`
                  : "Nessun salvataggio locale disponibile."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleExport}
                  className="rounded-full border border-border/70 bg-surface/80 px-4 py-2 text-xs font-semibold text-text"
                >
                  Esporta JSON
                </button>
                <button
                  type="button"
                  onClick={handleImportClick}
                  className="rounded-full border border-border/70 bg-surface/80 px-4 py-2 text-xs font-semibold text-text"
                >
                  Importa JSON
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  onChange={handleImport}
                  className="hidden"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-surface/70 px-4 py-3">
              <p className="font-semibold text-text">Cloud sync</p>
              <p className="text-xs text-muted">
                {cloudEnabled
                  ? "Firebase configurato: il salvataggio cloud e attivo."
                  : "Cloud disattivato: aggiungi le variabili VITE_FIREBASE_* per abilitarlo."}
              </p>
            </div>

            <div className="rounded-2xl border border-danger/40 bg-surface/70 px-4 py-3">
              <p className="font-semibold text-text">Reset account</p>
              <p className="text-xs text-muted">Cancella i dati locali e cloud con conferma.</p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-3 rounded-full border border-danger/70 px-4 py-2 text-xs font-semibold text-danger"
              >
                Reset account
              </button>
            </div>

            {(saveMessage || saveError) && (
              <p className={`text-xs ${saveError ? "text-danger" : "text-muted"}`}>
                {saveError ?? saveMessage}
              </p>
            )}
          </div>
        </GlassCard>

        <GlassCard title="Leva e rischio" subtitle="Gestione margine e onboarding">
          <div className="flex flex-col gap-4">
            <Switch
              checked={leverageEnabled}
              onChange={() => setLeverageEnabled(!leverageEnabled)}
              label="Leva opzionale"
              description="Abilita margine, interessi sul debito e chiamate di margine."
            />
            <Switch
              checked={blindMode}
              onChange={() => setBlindMode(!blindMode)}
              label="Modalita info lag"
              description="Report parziali e notizie rumor per aumentare la difficolta."
            />
            <div className="rounded-2xl border border-border/60 bg-surface/70 px-4 py-3 text-sm text-muted">
              <p className="font-semibold text-text">Riavvia onboarding</p>
              <p>Rivedi la guida rapida con le impostazioni principali.</p>
              <button
                type="button"
                onClick={openOnboarding}
                className="mt-3 rounded-full border border-border/70 bg-surface/80 px-4 py-2 text-xs font-semibold text-text"
              >
                Apri guida
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
