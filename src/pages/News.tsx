import GlassCard from "../components/ui/GlassCard";
import Tag from "../components/ui/Tag";
import PageTransition from "../components/layout/PageTransition";
import { useGameStore } from "../store/gameStore";

export default function News() {
  const news = useGameStore((state) => state.game.newsFeed);

  return (
    <PageTransition>
      <div className="grid gap-6">
        <GlassCard title="Notizie di mercato" subtitle="Timeline eventi e spiegazioni">
          {news.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-surface/70 px-4 py-6 text-sm text-muted">
              Nessun evento registrato. Chiudi la settimana per aggiornare le notizie.
            </div>
          ) : (
            <div className="space-y-4">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="glass-panel glass-highlight rounded-2xl px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-text">{item.title}</p>
                      <p className="text-xs text-muted">Settimana {item.week}</p>
                    </div>
                    <Tag tone={item.tone === "negative" ? "negative" : item.tone === "positive" ? "positive" : "neutral"}>
                      {item.impact}
                    </Tag>
                  </div>
                  <p className="mt-3 text-sm text-muted">{item.summary}</p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </PageTransition>
  );
}
