import { useMemo, useState } from "react";
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
  const stocks = useGameStore((state) => state.game.assets.stocks);
  const blindMode = useSettingsStore((state) => state.blindMode);
  const analyticsTier = useSettingsStore((state) => state.analyticsTier);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(stocks[0]?.id ?? null);

  const filteredStocks = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return stocks;
    return stocks.filter(
      (stockItem) =>
        stockItem.name.toLowerCase().includes(needle) ||
        stockItem.sector.toLowerCase().includes(needle)
    );
  }, [stocks, query]);

  const { quickPicks, undervalued, highVolatility } = useMemo(() => {
    const used = new Set<string>();

    const quick = [...stocks]
      .sort((a, b) => Math.abs(b.weeklyChange) - Math.abs(a.weeklyChange))
      .filter((item) => {
        if (used.has(item.id)) return false;
        used.add(item.id);
        return true;
      })
      .slice(0, 4);

    const undervaluedList = [...stocks]
      .filter((item) => item.fairValue > item.price)
      .sort((a, b) => (b.fairValue - b.price) / b.price - (a.fairValue - a.price) / a.price)
      .filter((item) => {
        if (used.has(item.id)) return false;
        used.add(item.id);
        return true;
      })
      .slice(0, 4);

    const volatilityList = [...stocks]
      .sort((a, b) => b.volatility - a.volatility)
      .filter((item) => {
        if (used.has(item.id)) return false;
        used.add(item.id);
        return true;
      })
      .slice(0, 4);

    return { quickPicks: quick, undervalued: undervaluedList, highVolatility: volatilityList };
  }, [stocks]);

  const selectedStock = useMemo(() => {
    const list = filteredStocks.length ? filteredStocks : stocks;
    const resolvedId = list.some((item) => item.id === selectedId) ? selectedId : list[0]?.id ?? null;
    if (!resolvedId) return null;
    return list.find((item) => item.id === resolvedId) ?? null;
  }, [filteredStocks, selectedId, stocks]);

  if (!selectedStock) {
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
        <GlassCard className="lg:col-span-2" title="Selezione titolo" subtitle="Scegli il dossier fondamentale">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              className="flex-1 rounded-full border border-border/70 bg-surface/70 px-4 py-2 text-sm text-text shadow-soft focus:outline-none"
              placeholder="Cerca azienda o settore..."
              aria-label="Cerca azienda o settore"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select
              className="rounded-full border border-border/70 bg-surface/70 px-4 py-2 text-sm text-text shadow-soft focus:outline-none"
              value={selectedStock.id}
              onChange={(event) => setSelectedId(event.target.value)}
              aria-label="Seleziona azienda"
            >
              {filteredStocks.map((stockItem) => (
                <option key={stockItem.id} value={stockItem.id}>
                  {stockItem.name} · {stockItem.sector}
                </option>
              ))}
            </select>
          </div>
          {quickPicks.length > 0 && (
            <div className="mt-3 space-y-3 text-xs text-muted">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-muted">Scelte rapide</span>
                {quickPicks.map((stockItem) => (
                  <button
                    key={stockItem.id}
                    type="button"
                    onClick={() => setSelectedId(stockItem.id)}
                    aria-pressed={selectedStock.id === stockItem.id}
                  >
                    <Tag tone={stockItem.weeklyChange >= 0 ? "positive" : "negative"}>
                      {stockItem.name}
                    </Tag>
                  </button>
                ))}
              </div>

              {undervalued.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-muted">Sottovalutati</span>
                  {undervalued.map((stockItem) => (
                    <button
                      key={stockItem.id}
                      type="button"
                      onClick={() => setSelectedId(stockItem.id)}
                      aria-pressed={selectedStock.id === stockItem.id}
                    >
                      <Tag tone="positive">{stockItem.name}</Tag>
                    </button>
                  ))}
                </div>
              )}

              {highVolatility.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-muted">Volatilita alta</span>
                  {highVolatility.map((stockItem) => (
                    <button
                      key={stockItem.id}
                      type="button"
                      onClick={() => setSelectedId(stockItem.id)}
                      aria-pressed={selectedStock.id === stockItem.id}
                    >
                      <Tag tone="warning">{stockItem.name}</Tag>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {filteredStocks.length === 0 && (
            <p className="mt-3 text-xs text-muted">Nessun risultato con questo filtro.</p>
          )}
        </GlassCard>

        <GlassCard title="Dossier fondamentale" subtitle={selectedStock.name}>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">Ricavi</span>
              <span className="font-semibold text-text">
                {blindMode
                  ? `€${formatRange(selectedStock.fundamentals.revenue, uncertainty)}M`
                  : `€${selectedStock.fundamentals.revenue.toFixed(0)}M`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Margine operativo</span>
              <span className="font-semibold text-success">
                {blindMode
                  ? `${formatRange(selectedStock.fundamentals.margin * 100, uncertainty)}%`
                  : formatPercent(selectedStock.fundamentals.margin * 100, 1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Debito netto</span>
              <span className="font-semibold text-warning">
                {blindMode
                  ? `€${formatRange(selectedStock.fundamentals.debt, uncertainty)}M`
                  : `€${selectedStock.fundamentals.debt.toFixed(0)}M`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Crescita attesa</span>
              <span className="font-semibold text-text">
                {blindMode
                  ? `${formatRange(selectedStock.fundamentals.growth * 100, uncertainty)}%`
                  : `${formatPercent(selectedStock.fundamentals.growth * 100, 1)} YoY`}
              </span>
            </div>
            <p className="text-muted">
              Settore {selectedStock.sector} con fondamentali in evoluzione e rischio{" "}
              {selectedStock.fundamentals.risk > 0.35 ? "elevato" : "gestibile"}.
            </p>
          </div>
        </GlassCard>

        <GlassCard title="Fair value" subtitle="Prezzo vs valore stimato">
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">Prezzo attuale</span>
              <span className="font-semibold text-text">{formatCurrency(selectedStock.price, 2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Fair value stimato</span>
              <span className="font-semibold text-text">
                {blindMode
                  ? `€${formatRange(selectedStock.fairValue, uncertainty)}`
                  : formatCurrency(selectedStock.fairValue, 2)}
              </span>
            </div>
            <Tag tone={selectedStock.fairValue >= selectedStock.price ? "positive" : "negative"}>
              {selectedStock.fairValue >= selectedStock.price ? "Sconto" : "Premio"}{" "}
              {formatPercent(
                Math.abs(((selectedStock.fairValue - selectedStock.price) / selectedStock.price) * 100),
                1
              )}
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
            Il settore {selectedStock.sector} mostra una dinamica coerente con il ciclo macro. Mantieni una
            quota bilanciata tra asset difensivi e growth, monitorando i tassi e il sentiment.
            {blindMode && " I dati avanzati sono disponibili con il pacchetto Pro."}
          </p>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
