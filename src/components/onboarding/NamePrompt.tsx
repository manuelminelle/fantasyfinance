import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useUiStore } from "../../store/uiStore";

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

export default function NamePrompt() {
  const displayName = useUiStore((state) => state.displayName);
  const setDisplayName = useUiStore((state) => state.setDisplayName);
  const [value, setValue] = useState("");

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setDisplayName(trimmed);
  };

  return (
    <AnimatePresence>
      {!displayName && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 px-6"
          {...backdropMotion}
        >
          <motion.div
            className="glass-panel glass-highlight w-full max-w-md rounded-[28px] p-6 text-text"
            {...panelMotion}
          >
            <div className="text-xs uppercase tracking-[0.2em] text-muted">Profilo</div>
            <h2 className="mt-3 font-display text-2xl text-text sm:text-3xl">Come ti chiami?</h2>
            <p className="mt-2 text-sm text-muted">
              Inserisci il tuo nome per personalizzare il saluto nella console.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <input
                className="w-full rounded-full border border-border/70 bg-surface/70 px-4 py-2 text-sm text-text shadow-soft focus:outline-none"
                placeholder="Il tuo nome"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSave();
                  }
                }}
                autoFocus
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="glass-panel glass-highlight rounded-full px-4 py-2 text-sm font-semibold text-text transition hover:-translate-y-0.5 hover:shadow-soft"
                >
                  Continua
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayName("Stratega")}
                  className="text-sm font-semibold text-muted transition hover:text-text"
                >
                  Salta
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
