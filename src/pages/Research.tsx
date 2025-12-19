import GlassCard from "../components/ui/GlassCard";
import Tag from "../components/ui/Tag";
import PageTransition from "../components/layout/PageTransition";
import { useGameStore } from "../store/gameStore";
import { useSettingsStore } from "../store/settingsStore";
import { formatCurrency, formatPercent } from "../utils/format";

function formatRange(value: number, percent: number) {
  const min = value * (1 - percent);
  const max = value * (1 + percent);
  return `${min.toFixed(0)} - ${max.toFixed(0)}`;
}

export default function Research() {
  const stock = useGameStore((state) => state.game.assets.stocks[0]);
  const blindMode = useSettingsStore((state) => state.blindMode);
  const analyticsTier = useSettingsStore((state) => state.analyticsTier);

  if (!stock) {
    return (
      <PageTransition>
        <GlassCard title="Ricerca" subtitle="Nessun dato disponibile">
          <p className="text-sm text-muted">Carica i dati di mercato per iniziare l'analisi.</p>
        </GlassCard>
      </PageTransition>
    );
  }

  const uncertainty = analyticsTier === "pro" ? 0.06 : 0.12;

  return (
    <PageTransition>
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard title="Dossier fondamentale" subtitle={stock.name}>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">Ricavi</span>
              <span className="font-semibold text-text">
                {blindMode ? `€${formatRange(stock.fundamentals.revenue, uncertainty)}M` : `€${stock.fundamentals.revenue.toFixed(0)}M`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Margine operativo</span>
              <span className="font-semibold text-success">
                {blindMode
                  ? `${formatRange(stock.fundamentals.margin * 100, uncertainty)}%`
                  : formatPercent(stock.fundamentals.margin * 100, 1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Debito netto</span>
              <span className="font-semibold text-warning">
                {blindMode ? `€${formatRange(stock.fundamentals.debt, uncertainty)}M` : `€${stock.fundamentals.debt.toFixed(0)}M`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Crescita attesa</span>
              <span className="font-semibold text-text">
                {blindMode
                  ? `${formatRange(stock.fundamentals.growth * 100, uncertainty)}%`
                  : `${formatPercent(stock.fundamentals.growth * 100, 1)} YoY`}
              </span>
            </div>
            <p className="text-muted">
              Settore {stock.sector} con fondamentali in evoluzione e rischio {stock.fundamentals.risk > 0.35 ? "elevato" : "gestibile"}.
            </p>
          </div>
        </GlassCard>

        <GlassCard title="Fair value" subtitle="Prezzo vs valore stimato">
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">Prezzo attuale</span>
              <span className="font-semibold text-text">{formatCurrency(stock.price, 2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Fair value stimato</span>
              <span className="font-semibold text-text">
                {blindMode
                  ? `€${formatRange(stock.fairValue, uncertainty)}`
                  : formatCurrency(stock.fairValue, 2)}
              </span>
            </div>
            <Tag tone={stock.fairValue >= stock.price ? "positive" : "negative"}>
              {stock.fairValue >= stock.price ? "Sconto" : "Premio"} {formatPercent(Math.abs(((stock.fairValue - stock.price) / stock.price) * 100), 1)}
            </Tag>
            <p className="text-muted">
              {blindMode
                ? "Modalita info lag attiva: i dati sono stimati con margine di errore."
                : "Il modello combina crescita, rischio e sentiment per stimare un valore equo."}
            </p>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2" title="Rapporto analista" subtitle="Sintesi settimanale">
          <p className="text-sm text-muted">
            Il settore {stock.sector} mostra una dinamica coerente con il ciclo macro. Mantieni una
            quota bilanciata tra asset difensivi e growth, monitorando i tassi e il sentiment.
            {blindMode && " I dati avanzati sono disponibili con il pacchetto Pro."}
          </p>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
