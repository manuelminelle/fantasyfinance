import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { useSettingsStore } from "../../store/settingsStore";
import { useUiStore } from "../../store/uiStore";
import ThemeToggle from "../ui/ThemeToggle";
import Switch from "../ui/Switch";

const backdropMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
} as const;

const panelMotion = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 24, scale: 0.98 },
  transition: { duration: 0.3, ease: "easeOut" },
} as const;

export default function Onboarding() {
  const isOpen = useUiStore((state) => state.onboardingOpen);
  const step = useUiStore((state) => state.onboardingStep);
  const next = useUiStore((state) => state.nextOnboarding);
  const prev = useUiStore((state) => state.prevOnboarding);
  const skip = useUiStore((state) => state.skipOnboarding);

  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const leverageEnabled = useSettingsStore((state) => state.leverageEnabled);
  const blindMode = useSettingsStore((state) => state.blindMode);
  const setSoundEnabled = useSettingsStore((state) => state.setSoundEnabled);
  const setLeverageEnabled = useSettingsStore((state) => state.setLeverageEnabled);
  const setBlindMode = useSettingsStore((state) => state.setBlindMode);

  const steps = useMemo(
    () => [
      {
        title: "Benvenuto in MarketCraft",
        description:
          "Gestisci il tuo capitale e attraversa cicli macroeconomici simulati. Ogni settimana e una decisione strategica.",
        content: null,
      },
      {
        title: "Scegli il tuo stile",
        description: "Tema chiaro o scuro: la console si adatta al tuo ritmo di trading.",
        content: <ThemeToggle />,
      },
      {
        title: "Feedback sensoriale",
        description: "Attiva effetti sonori premium per segnali discreti e conferme rapide.",
        content: (
          <Switch
            checked={soundEnabled}
            onChange={() => setSoundEnabled(!soundEnabled)}
            label="Audio premium"
            description="Click morbidi, successi e avvisi di errore."
          />
        ),
      },
      {
        title: "Rischio e informazione",
        description: "Puoi usare la leva o ridurre la chiarezza delle notizie per una sfida extra.",
        content: (
          <div className="grid gap-3">
            <Switch
              checked={leverageEnabled}
              onChange={() => setLeverageEnabled(!leverageEnabled)}
              label="Leva opzionale"
              description="Sblocca margine e potenziale rendimento extra."
            />
            <Switch
              checked={blindMode}
              onChange={() => setBlindMode(!blindMode)}
              label="Modalita info lag"
              description="Report parziali e notizie piu rumorose."
            />
          </div>
        ),
      },
      {
        title: "Pronto alla prima settimana",
        description:
          "Controlla la dashboard, apri posizioni sui mercati e chiudi la settimana per aggiornare gli scenari.",
        content: null,
      },
    ],
    [soundEnabled, leverageEnabled, blindMode, setSoundEnabled, setLeverageEnabled, setBlindMode]
  );

  const current = steps[step];
  const isLast = step >= steps.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-6"
          {...backdropMotion}
        >
          <motion.div
            className="glass-panel glass-highlight w-full max-w-xl rounded-[28px] p-5 text-text sm:rounded-[32px] sm:p-6 lg:p-8"
            {...panelMotion}
          >
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted">
              <span>Onboarding</span>
              <span>
                {step + 1}/{steps.length}
              </span>
            </div>
            <h2 className="mt-4 font-display text-2xl text-text sm:text-3xl">{current.title}</h2>
            <p className="mt-3 text-sm text-muted">{current.description}</p>
            {current.content && <div className="mt-6">{current.content}</div>}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={skip}
                className="text-sm font-semibold text-muted transition hover:text-text"
              >
                Salta
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={prev}
                  className="glass-panel rounded-full px-4 py-2 text-sm font-semibold text-muted transition hover:-translate-y-0.5 hover:shadow-soft"
                  disabled={step === 0}
                >
                  Indietro
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="glass-panel glass-highlight rounded-full px-5 py-2 text-sm font-semibold text-text transition hover:-translate-y-0.5 hover:shadow-soft"
                >
                  {isLast ? "Inizia" : "Avanti"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
