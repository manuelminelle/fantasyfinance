import GlassCard from "../components/ui/GlassCard";
import Tag from "../components/ui/Tag";
import PageTransition from "../components/layout/PageTransition";
import { useSettingsStore } from "../store/settingsStore";
import type { ScenarioSettings } from "../store/settingsStore";

const presets: Array<{ name: string; desc: string; tag: string; config: Partial<ScenarioSettings> }> = [
  {
    name: "Bilanciato",
    desc: "Volatilita media, eventi standard",
    tag: "Default",
    config: { startingCash: 10000, volatility: "media", eventFrequency: 2, recessionProbability: 12 },
  },
  {
    name: "Conservativo",
    desc: "Shock ridotti, crescita lenta",
    tag: "Difensivo",
    config: { startingCash: 12000, volatility: "bassa", eventFrequency: 1, recessionProbability: 8 },
  },
  {
    name: "Aggressivo",
    desc: "Eventi frequenti, volatilita alta",
    tag: "Sfida",
    config: { startingCash: 8000, volatility: "alta", eventFrequency: 3, recessionProbability: 18 },
  },
];

export default function Scenario() {
  const scenario = useSettingsStore((state) => state.scenario);
  const updateScenario = useSettingsStore((state) => state.updateScenario);
  const leverageEnabled = useSettingsStore((state) => state.leverageEnabled);
  const infoLagLevel = useSettingsStore((state) => state.infoLagLevel);

  return (
    <PageTransition>
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard title="Preset difficolta" subtitle="Seleziona un profilo">
          <div className="space-y-4">
            {presets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => updateScenario(preset.config)}
                className="glass-panel glass-highlight w-full rounded-2xl px-4 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-text">{preset.name}</p>
                    <p className="text-xs text-muted">{preset.desc}</p>
                  </div>
                  <Tag>{preset.tag}</Tag>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Scenario personalizzato" subtitle="Parametri base">
          <div className="space-y-4 text-sm">
            <div className="rounded-2xl border border-border/60 bg-surface/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Cassa iniziale</p>
              <input
                type="number"
                min={1000}
                step={500}
                value={scenario.startingCash}
                onChange={(event) => updateScenario({ startingCash: Number(event.target.value) })}
                className="mt-2 w-full rounded-full border border-border/70 bg-surface/80 px-4 py-2 text-sm text-text"
              />
            </div>
            <div className="rounded-2xl border border-border/60 bg-surface/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Volatilita</p>
              <div className="mt-2 flex gap-2">
                {(["bassa", "media", "alta"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateScenario({ volatility: level })}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      scenario.volatility === level
                        ? "bg-accent/80 text-white"
                        : "bg-surface/80 text-muted"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-surface/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Frequenza eventi</p>
              <input
                type="range"
                min={1}
                max={3}
                value={scenario.eventFrequency}
                onChange={(event) => updateScenario({ eventFrequency: Number(event.target.value) })}
                className="mt-2 w-full"
              />
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>Bassa</span>
                <span>Alta</span>
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-surface/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Probabilita recessione</p>
              <input
                type="range"
                min={4}
                max={25}
                value={scenario.recessionProbability}
                onChange={(event) => updateScenario({ recessionProbability: Number(event.target.value) })}
                className="mt-2 w-full"
              />
              <p className="mt-2 text-xs text-muted">{scenario.recessionProbability}%</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-surface/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Leva disponibile</p>
              <p className="text-sm text-text">{leverageEnabled ? "Attiva" : "Disattiva"}</p>
              <p className="text-xs text-muted">Gestita dalle impostazioni globali.</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-surface/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Info lag</p>
              <p className="text-sm text-text">Livello {infoLagLevel}</p>
              <p className="text-xs text-muted">Collegato alla modalita info lag.</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
