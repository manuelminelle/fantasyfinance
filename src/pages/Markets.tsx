import { useMemo, useState } from "react";
import GlassCard from "../components/ui/GlassCard";
import Tag from "../components/ui/Tag";
import PageTransition from "../components/layout/PageTransition";
import { useGameStore } from "../store/gameStore";
import { useSettingsStore } from "../store/settingsStore";
import { formatCurrency, formatPercent, formatSignedPercent } from "../utils/format";
import type { BondAsset, CommodityAsset, EtfAsset, StockAsset } from "../types/engine";
import { playSfx } from "../services/sfx";

const sectors = ["Tutti", "Tech", "Energy", "Healthcare", "Consumer", "Industrials"] as const;

type SectorFilter = (typeof sectors)[number];

type AssetClassKey = "stock" | "bond" | "etf" | "commodity";

const assetClassLabels: Record<AssetClassKey, string> = {
  stock: "Azioni",
  bond: "Obbligazioni",
  etf: "ETF",
  commodity: "Materie prime",
};

function volatilityLabel(value: number) {
  if (value >= 0.06) return "Alta";
  if (value >= 0.045) return "Media";
  return "Bassa";
}

export default function Markets() {
  const stocks = useGameStore((state) => state.game.assets.stocks);
  const bonds = useGameStore((state) => state.game.assets.bonds);
  const etfs = useGameStore((state) => state.game.assets.etfs);
  const commodities = useGameStore((state) => state.game.assets.commodities);
  const cash = useGameStore((state) => state.game.portfolio.cash);
  const tradeMessage = useGameStore((state) => state.tradeMessage);
  const buy = useGameStore((state) => state.buy);
  const sell = useGameStore((state) => state.sell);

  const leverageEnabled = useSettingsStore((state) => state.leverageEnabled);

  const [assetClass, setAssetClass] = useState<AssetClassKey>("stock");
  const [sectorFilter, setSectorFilter] = useState<SectorFilter>("Tutti");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(100);
  const [mobileSort, setMobileSort] = useState<"price" | "change" | "volatility">("change");

  const assetsByClass = {
    stock: stocks,
    bond: bonds,
    etf: etfs,
    commodity: commodities,
  } as const;

  const assetList = assetsByClass[assetClass];

  const filteredAssets = useMemo(() => {
    const filtered = assetList.filter((asset) => {
      const matchesQuery = asset.name.toLowerCase().includes(query.toLowerCase());
      if (assetClass === "stock" || assetClass === "etf") {
        const withSector = asset as StockAsset | EtfAsset;
        const matchesSector = sectorFilter === "Tutti" || withSector.sector === sectorFilter;
        return matchesSector && matchesQuery;
      }
      return matchesQuery;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (mobileSort === "price") return b.price - a.price;
      if (mobileSort === "volatility") return b.volatility - a.volatility;
      return Math.abs(b.weeklyChange) - Math.abs(a.weeklyChange);
    });

    return sorted;
  }, [assetList, assetClass, sectorFilter, query, mobileSort]);

  const selectedAsset = useMemo(() => {
    const hasSelected = selectedId ? assetList.some((asset) => asset.id === selectedId) : false;
    const targetId = hasSelected ? selectedId : filteredAssets[0]?.id ?? assetList[0]?.id;
    if (!targetId) return null;
    return assetList.find((asset) => asset.id === targetId) ?? null;
  }, [assetList, filteredAssets, selectedId]);

  const quantityValue = Number.isFinite(quantity) ? quantity : 0;

  function handleBuy() {
    if (!selectedAsset) return;
    const error = buy(selectedAsset.id, assetClass, quantityValue, leverageEnabled);
    playSfx(error ? "error" : "confirm");
  }

  function handleSell() {
    if (!selectedAsset) return;
    const error = sell(selectedAsset.id, assetClass, quantityValue);
    playSfx(error ? "error" : "confirm");
  }

  const detailSection = (() => {
    if (!selectedAsset) {
      return <p className="text-sm text-muted">Nessun asset disponibile.</p>;
    }

    if (assetClass === "stock" || assetClass === "etf") {
      const asset = selectedAsset as StockAsset | EtfAsset;
      return (
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">Prezzo</span>
            <span className="font-semibold text-text">{formatCurrency(asset.price, 2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Fair value</span>
            <span className="font-semibold text-text">{formatCurrency(asset.fairValue, 2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Settore</span>
            <span className="font-semibold text-text">{asset.sector}</span>
          </div>
          {"sentiment" in asset && (
            <div className="flex items-center justify-between">
              <span className="text-muted">Sentiment</span>
              <span className="font-semibold text-success">{asset.sentiment >= 0 ? "Positivo" : "Prudente"}</span>
            </div>
          )}
          <p className="text-muted">
            Volatilita {volatilityLabel(asset.volatility).toLowerCase()} e trend settimanale {formatSignedPercent(asset.weeklyChange * 100, 1)}.
          </p>
        </div>
      );
    }

    if (assetClass === "bond") {
      const asset = selectedAsset as BondAsset;
      return (
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">Prezzo</span>
            <span className="font-semibold text-text">{formatCurrency(asset.price, 2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Duration</span>
            <span className="font-semibold text-text">{asset.duration.toFixed(1)} anni</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Yield</span>
            <span className="font-semibold text-text">{formatPercent(asset.yield, 1)}</span>
          </div>
          <p className="text-muted">
            Sensibile ai tassi: variazione settimanale {formatSignedPercent(asset.weeklyChange * 100, 1)}.
          </p>
        </div>
      );
    }

    const asset = selectedAsset as CommodityAsset;
    return (
      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted">Prezzo</span>
          <span className="font-semibold text-text">{formatCurrency(asset.price, 2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Trend macro</span>
          <span className="font-semibold text-text">{formatSignedPercent(asset.trend * 100, 1)}</span>
        </div>
        <p className="text-muted">
          Materia prima con volatilita {volatilityLabel(asset.volatility).toLowerCase()}.
        </p>
      </div>
    );
  })();

  return (
    <PageTransition>
      <div className="grid gap-6">
        <GlassCard title="Mercati" subtitle="Asset principali e trend settimanali">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {(["stock", "bond", "etf", "commodity"] as AssetClassKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setAssetClass(key)}
                  aria-pressed={assetClass === key}
                >
                  <Tag tone={assetClass === key ? "positive" : "neutral"}>{assetClassLabels[key]}</Tag>
                </button>
              ))}
            </div>
            <input
              className="rounded-full border border-border/70 bg-surface/70 px-4 py-2 text-sm text-text shadow-soft focus:outline-none"
              placeholder="Cerca asset..."
              aria-label="Cerca asset"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {(assetClass === "stock" || assetClass === "etf") && (
            <div className="mt-4 flex flex-wrap gap-2">
              {sectors.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setSectorFilter(label)}
                  aria-pressed={sectorFilter === label}
                >
                  <Tag tone={sectorFilter === label ? "positive" : "neutral"}>{label}</Tag>
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-3 sm:hidden">
            <div className="sticky top-3 z-10 flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-surface/80 px-3 py-2 backdrop-blur">
              <span className="text-[11px] uppercase tracking-[0.18em] text-muted">Ordina</span>
              {[
                { key: "change", label: "Var%" },
                { key: "price", label: "Prezzo" },
                { key: "volatility", label: "Volatilita" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setMobileSort(item.key as "price" | "change" | "volatility")}
                  aria-pressed={mobileSort === item.key}
                >
                  <Tag tone={mobileSort === item.key ? "positive" : "neutral"}>{item.label}</Tag>
                </button>
              ))}
            </div>
            {filteredAssets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => setSelectedId(asset.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  selectedAsset?.id === asset.id
                    ? "border-accent/50 bg-surface/80 shadow-soft"
                    : "border-border/50 bg-surface/60"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-text">{asset.name}</p>
                    {(assetClass === "stock" || assetClass === "etf") && (
                      <p className="text-xs text-muted">{(asset as StockAsset | EtfAsset).sector}</p>
                    )}
                    {assetClass === "bond" && (
                      <p className="text-xs text-muted">{(asset as BondAsset).duration.toFixed(1)}y</p>
                    )}
                    {assetClass === "commodity" && (
                      <p className="text-xs text-muted">
                        Trend {formatSignedPercent((asset as CommodityAsset).trend * 100, 1)}
                      </p>
                    )}
                  </div>
                  <Tag tone={asset.weeklyChange < 0 ? "negative" : "positive"}>
                    {formatSignedPercent(asset.weeklyChange * 100, 1)}
                  </Tag>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted">
                  <span>Prezzo</span>
                  <span className="font-semibold text-text">{formatCurrency(asset.price, 2)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-muted">
                  <span>Volatilita</span>
                  <span>{volatilityLabel(asset.volatility)}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-border/60 sm:block">
            <table className="w-full min-w-[640px] table-fixed text-left text-sm" aria-label="Tabella mercati">
              <thead className="bg-surface/80 text-xs uppercase tracking-[0.18em] text-muted">
                <tr>
                  <th className="px-4 py-3" scope="col">Asset</th>
                  {(assetClass === "stock" || assetClass === "etf") && (
                    <th className="px-4 py-3" scope="col">Settore</th>
                  )}
                  {assetClass === "bond" && <th className="px-4 py-3" scope="col">Duration</th>}
                  {assetClass === "commodity" && <th className="px-4 py-3" scope="col">Trend</th>}
                  <th className="px-4 py-3" scope="col">Prezzo</th>
                  <th className="px-4 py-3" scope="col">Settimana</th>
                  <th className="px-4 py-3" scope="col">Volatilita</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className={`cursor-pointer outline-none transition focus-visible:ring-2 focus-visible:ring-accent/50 ${
                      selectedAsset?.id === asset.id ? "bg-surface/80" : "bg-surface/60"
                    }`}
                    onClick={() => setSelectedId(asset.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedId(asset.id);
                      }
                    }}
                    tabIndex={0}
                    aria-selected={selectedAsset?.id === asset.id}
                  >
                    <td className="px-4 py-3 font-semibold text-text">{asset.name}</td>
                    {(assetClass === "stock" || assetClass === "etf") && (
                      <td className="px-4 py-3 text-muted">{(asset as StockAsset | EtfAsset).sector}</td>
                    )}
                    {assetClass === "bond" && (
                      <td className="px-4 py-3 text-muted">{(asset as BondAsset).duration.toFixed(1)}y</td>
                    )}
                    {assetClass === "commodity" && (
                      <td className="px-4 py-3 text-muted">
                        {formatSignedPercent((asset as CommodityAsset).trend * 100, 1)}
                      </td>
                    )}
                    <td className="px-4 py-3 text-text">{formatCurrency(asset.price, 2)}</td>
                    <td className="px-4 py-3">
                      <Tag tone={asset.weeklyChange < 0 ? "negative" : "positive"}>
                        {formatSignedPercent(asset.weeklyChange * 100, 1)}
                      </Tag>
                    </td>
                    <td className="px-4 py-3 text-muted">{volatilityLabel(asset.volatility)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard title="Dettaglio asset" subtitle={selectedAsset?.name ?? "Seleziona un asset"}>
            {detailSection}
          </GlassCard>

          <GlassCard title="Trade rapido" subtitle="Acquista / Vendi">
            <div className="grid gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">Cassa disponibile</span>
                <span className="font-semibold text-text">{formatCurrency(cash)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Quantita</span>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value))}
                  className="w-24 rounded-full border border-border/70 bg-surface/70 px-3 py-1 text-right text-sm text-text"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Costo stimato</span>
                <span className="font-semibold text-text">
                  {formatCurrency((selectedAsset?.price ?? 0) * quantityValue, 2)}
                </span>
              </div>
              {tradeMessage && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-xs font-semibold ${
                    tradeMessage.type === "error"
                      ? "border-rose-400/40 bg-rose-500/10 text-rose-500"
                      : "border-emerald-400/40 bg-emerald-500/10 text-emerald-500"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {tradeMessage.text}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  className="glass-panel glass-highlight flex-1 rounded-full px-4 py-2 font-semibold text-text transition hover:-translate-y-0.5 hover:shadow-soft"
                  onClick={handleBuy}
                >
                  Compra
                </button>
                <button
                  className="glass-panel flex-1 rounded-full px-4 py-2 font-semibold text-muted transition hover:-translate-y-0.5 hover:shadow-soft"
                  onClick={handleSell}
                >
                  Vendi
                </button>
              </div>
              <p className="text-xs text-muted">
                {leverageEnabled
                  ? "Leva attiva: puoi usare margine entro i limiti di rischio."
                  : "Leva disattivata: operazioni basate su cassa disponibile."}
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
}
