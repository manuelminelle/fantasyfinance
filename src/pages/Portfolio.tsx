import GlassCard from "../components/ui/GlassCard";
import Tag from "../components/ui/Tag";
import PageTransition from "../components/layout/PageTransition";
import { useGameStore } from "../store/gameStore";
import { formatCurrency } from "../utils/format";

export default function Portfolio() {
  const game = useGameStore((state) => state.game);
  const positions = game.portfolio.positions;

  const assetMap = new Map(
    [...game.assets.stocks, ...game.assets.bonds, ...game.assets.etfs, ...game.assets.commodities].map(
      (asset) => [asset.id, asset]
    )
  );

  const positionRows = positions.map((position) => {
    const asset = assetMap.get(position.assetId);
    const price = asset?.price ?? 0;
    const name = asset?.name ?? position.assetId;
    const currentValue = price * position.quantity;
    const entryValue = position.avgPrice * position.quantity;
    const pnl = currentValue - entryValue;

    return {
      id: position.assetId,
      name,
      size: position.quantity,
      entry: position.avgPrice,
      current: price,
      pnl,
    };
  });

  const unrealizedPnl = positionRows.reduce((sum, row) => sum + row.pnl, 0);

  return (
    <PageTransition>
      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard title="Riepilogo P&L" subtitle="Settimana corrente">
          <p className="text-2xl font-semibold text-text sm:text-3xl">{formatCurrency(unrealizedPnl)}</p>
          <p className="text-sm text-muted">Unrealizzato {formatCurrency(unrealizedPnl)}</p>
          <p className="text-sm text-muted">Realizzato {formatCurrency(game.portfolio.realizedPnl)}</p>
        </GlassCard>
        <GlassCard title="Rischio" subtitle="Metriche rapide">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">Volatilita portafoglio</span>
              <span className="font-semibold text-text">12,4%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">VaR (95%)</span>
              <span className="font-semibold text-text">€740</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Drawdown</span>
              <span className="font-semibold text-warning">-5,2%</span>
            </div>
          </div>
        </GlassCard>
        <GlassCard title="Liquidita" subtitle="Cassa e margine">
          <p className="text-2xl font-semibold text-text sm:text-3xl">{formatCurrency(game.portfolio.cash)}</p>
          <p className="text-sm text-muted">Margine disponibile €2.100</p>
        </GlassCard>

        <GlassCard className="lg:col-span-3" title="Posizioni aperte" subtitle="Azioni, ETF e obbligazioni">
          {positionRows.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-surface/70 px-4 py-6 text-sm text-muted">
              Nessuna posizione aperta. Seleziona un asset dai mercati per iniziare a investire.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border/60">
              <table className="w-full min-w-[640px] table-fixed text-left text-sm" aria-label="Tabella posizioni">
                <thead className="bg-surface/80 text-xs uppercase tracking-[0.18em] text-muted">
                  <tr>
                    <th className="px-4 py-3" scope="col">Asset</th>
                    <th className="px-4 py-3" scope="col">Quantita</th>
                    <th className="px-4 py-3" scope="col">Prezzo medio</th>
                    <th className="px-4 py-3" scope="col">Prezzo attuale</th>
                    <th className="px-4 py-3" scope="col">P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {positionRows.map((position) => (
                    <tr key={position.id} className="bg-surface/60">
                      <td className="px-4 py-3 font-semibold text-text">{position.name}</td>
                      <td className="px-4 py-3 text-muted">{position.size}</td>
                      <td className="px-4 py-3 text-text">{formatCurrency(position.entry, 2)}</td>
                      <td className="px-4 py-3 text-text">{formatCurrency(position.current, 2)}</td>
                      <td className="px-4 py-3">
                        <Tag tone={position.pnl < 0 ? "negative" : "positive"}>
                          {formatCurrency(position.pnl, 2)}
                        </Tag>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </div>
    </PageTransition>
  );
}
