import { useMemo } from "react";
import GlassCard from "../components/ui/GlassCard";
import Tag from "../components/ui/Tag";
import NetWorthChart from "../components/charts/NetWorthChart";
import PageTransition from "../components/layout/PageTransition";
import { useGameStore } from "../store/gameStore";
import { formatCurrency, formatPercent, formatSignedPercent } from "../utils/format";

export default function Dashboard() {
  const netWorthHistory = useGameStore((state) => state.game.netWorthHistory);
  const macro = useGameStore((state) => state.game.macro);
  const stocks = useGameStore((state) => state.game.assets.stocks);
  const cash = useGameStore((state) => state.game.portfolio.cash);

  const latestWorth = netWorthHistory[netWorthHistory.length - 1]?.value ?? 0;
  const previousWorth = netWorthHistory[netWorthHistory.length - 2]?.value ?? latestWorth;
  const weeklyChange = latestWorth - previousWorth;

  const topMovers = useMemo(() => {
    return [...stocks]
      .sort((a, b) => Math.abs(b.weeklyChange) - Math.abs(a.weeklyChange))
      .slice(0, 3);
  }, [stocks]);

  const macroRows = [
    { label: "Inflazione", value: formatPercent(macro.inflation, 1), trend: "in calo" },
    { label: "Tasso BCE", value: formatPercent(macro.rate, 1), trend: "stabile" },
    { label: "Disoccupazione", value: formatPercent(macro.unemployment, 1), trend: "in salita" },
    { label: "PIL", value: formatPercent(macro.gdp, 1), trend: macro.gdp >= 0 ? "positivo" : "negativo" },
  ];

  return (
    <PageTransition>
      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2" title="Valore netto" subtitle="Aggiornamento settimanale">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="text-2xl font-semibold text-text sm:text-3xl">{formatCurrency(latestWorth)}</p>
              <p className="text-sm text-muted">
                {weeklyChange >= 0 ? "+" : "-"}
                {formatCurrency(Math.abs(weeklyChange))} questa settimana
              </p>
            </div>
            <Tag tone={weeklyChange >= 0 ? "positive" : "negative"}>
              {weeklyChange >= 0 ? "Momentum positivo" : "Pressione ribassista"}
            </Tag>
          </div>
          <div className="mt-6">
            <NetWorthChart data={netWorthHistory} />
          </div>
        </GlassCard>

        <GlassCard title="Liquidita" subtitle="Disponibilita immediata">
          <p className="text-2xl font-semibold text-text sm:text-3xl">{formatCurrency(cash)}</p>
          <p className="text-sm text-muted">Margine utilizzato 12%</p>
          <div className="mt-6 flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">Rendimento YTD</span>
              <span className="font-semibold text-success">+18,2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Drawdown max</span>
              <span className="font-semibold text-warning">-6,1%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Rischio</span>
              <span className="font-semibold text-text">Moderato</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Indicatori macro" subtitle="Settimana corrente">
          <div className="grid gap-4">
            {macroRows.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-muted">{item.label}</span>
                <div className="text-right">
                  <p className="font-semibold text-text">{item.value}</p>
                  <p className="text-xs text-muted">{item.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Eventi chiave" subtitle="Perche i prezzi si muovono">
          <div className="flex flex-col gap-4">
            {topMovers.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text">{item.name}</p>
                  <p className="text-xs text-muted">{item.sector}</p>
                </div>
                <Tag tone={item.weeklyChange < 0 ? "negative" : "positive"}>
                  {formatSignedPercent(item.weeklyChange * 100, 1)}
                </Tag>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Allocazione" subtitle="Distribuzione per asset">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">Azioni</span>
              <span className="font-semibold text-text">48%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">ETF</span>
              <span className="font-semibold text-text">22%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Obbligazioni</span>
              <span className="font-semibold text-text">20%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Materie prime</span>
              <span className="font-semibold text-text">10%</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
