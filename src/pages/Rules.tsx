import GlassCard from "../components/ui/GlassCard";
import Tag from "../components/ui/Tag";
import PageTransition from "../components/layout/PageTransition";

const quickSteps = [
  {
    step: "1",
    title: "Leggi il contesto",
    description: "Dashboard, macro e news per capire fase e rischio dominante.",
  },
  {
    step: "2",
    title: "Seleziona l'asset",
    description: "Scegli tra azioni, obbligazioni, ETF e materie prime.",
  },
  {
    step: "3",
    title: "Esegui il trade",
    description: "Compra o vendi, aggiorna la tua esposizione e la cassa.",
  },
  {
    step: "4",
    title: "Fine settimana",
    description: "I prezzi cambiano, arrivano eventi e nuove notizie.",
  },
  {
    step: "5",
    title: "Ribilancia",
    description: "Monitora il P&L e ridistribuisci il rischio.",
  },
];

const tradingRules = [
  "I prezzi sono quelli correnti del mercato in quella settimana.",
  "Le vendite liberano cassa e rendono effettivo il P&L.",
  "La volatilita influenza l'ampiezza dei movimenti.",
  "Le news possono accelerare trend o inversioni di breve periodo.",
];

const riskRules = [
  "La fase macro influenza i settori in modo diverso.",
  "Eventi e shock aumentano volatilita e dispersione dei rendimenti.",
  "Diversificare riduce drawdown e oscillazioni.",
  "Monitorare cash e posizioni evita blocchi operativi.",
];

const modeCards = [
  {
    title: "Leva",
    description:
      "Se attiva, puoi investire oltre la cassa disponibile. Aumenta il rischio: le perdite si amplificano.",
  },
  {
    title: "Info lag",
    description:
      "Introduzione di rumore nei dati e nelle notizie per aumentare la difficolta.",
  },
];

const scenarioItems = [
  "Cassa iniziale",
  "Volatilita di mercato",
  "Frequenza eventi",
  "Probabilita di recessione",
];

const tips = [
  "Inizia con asset liquidi e diversificati per ridurre lo stress iniziale.",
  "Evita esposizioni concentrate: distribuisci per settore e asset class.",
  "Usa il ciclo macro per decidere quando aumentare o ridurre il rischio.",
  "Preferisci decisioni progressive invece di all-in improvvisi.",
];

export default function Rules() {
  return (
    <PageTransition>
      <div className="grid gap-6">
        <GlassCard className="relative overflow-hidden">
          <div className="absolute -top-20 right-[-10%] h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(42,122,255,0.35),_transparent_65%)] blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-5%] h-52 w-52 rounded-full bg-[radial-gradient(circle,_rgba(0,214,173,0.28),_transparent_60%)] blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted">Guida rapida</p>
              <h2 className="mt-2 font-display text-2xl text-text sm:text-3xl">Regole del gioco</h2>
              <p className="mt-2 text-sm text-muted">
                Obiettivo, turni e gestione del rischio in un formato chiaro e veloce.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Tag tone="positive">Turno settimanale</Tag>
              <Tag tone="neutral">Decisioni tattiche</Tag>
              <Tag tone="warning">Rischio reale</Tag>
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-6 lg:grid-cols-3">
          <GlassCard title="Obiettivo" subtitle="Crescita del patrimonio">
            <p className="text-sm text-muted">
              Fai crescere il patrimonio netto nel tempo bilanciando rendimento e stabilita. Non esiste una
              data di fine: la performance e misurata sulla durata e sul controllo del rischio.
            </p>
          </GlassCard>
          <GlassCard title="Risorse" subtitle="Cassa, posizioni, P&L">
            <div className="space-y-2 text-sm">
              <p className="text-muted">Cassa disponibile per i trade.</p>
              <p className="text-muted">Posizioni aperte con prezzo medio e valore corrente.</p>
              <p className="text-muted">P&L realizzato e non realizzato per valutare l'efficienza.</p>
            </div>
          </GlassCard>
          <GlassCard title="Metriche chiave" subtitle="Macro e rischio">
            <div className="space-y-2 text-sm">
              <p className="text-muted">Fase macro, tassi e sentiment guidano il tono del mercato.</p>
              <p className="text-muted">Volatilita e news cambiano la velocita dei movimenti.</p>
              <p className="text-muted">Diversificazione riduce drawdown e oscillazioni.</p>
            </div>
          </GlassCard>
        </div>

        <GlassCard title="Loop settimanale" subtitle="Sequenza delle decisioni">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {quickSteps.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border border-border/60 bg-surface/70 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
                    {step.step}
                  </span>
                  <p className="text-sm font-semibold text-text">{step.title}</p>
                </div>
                <p className="mt-2 text-xs text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard title="Regole di trading" subtitle="Acquisti e vendite">
            <div className="space-y-3 text-sm">
              {tradingRules.map((rule) => (
                <div key={rule} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                  <p className="text-muted">{rule}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard title="Macro e rischio" subtitle="Cosa influenza i risultati">
            <div className="space-y-3 text-sm">
              {riskRules.map((rule) => (
                <div key={rule} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent-2" />
                  <p className="text-muted">{rule}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard title="Modalita speciali" subtitle="Leva e info lag">
            <div className="space-y-4 text-sm">
              {modeCards.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border/60 bg-surface/70 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">{item.title}</p>
                  <p className="mt-2 text-sm text-text">{item.description}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard title="Scenario" subtitle="Preset e parametri">
            <div className="space-y-3 text-sm text-muted">
              <p>Puoi selezionare un preset o personalizzare i parametri di simulazione:</p>
              <div className="flex flex-wrap gap-2">
                {scenarioItems.map((item) => (
                  <Tag key={item} tone="neutral">
                    {item}
                  </Tag>
                ))}
              </div>
              <p className="text-xs text-muted">
                Le impostazioni influenzano la frequenza degli eventi e la difficolta complessiva.
              </p>
            </div>
          </GlassCard>
        </div>

        <GlassCard title="Suggerimenti rapidi" subtitle="Disciplina e metodo">
          <div className="grid gap-3 md:grid-cols-2">
            {tips.map((tip) => (
              <div key={tip} className="rounded-2xl border border-border/60 bg-surface/70 px-4 py-3 text-sm">
                <p className="text-muted">{tip}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
