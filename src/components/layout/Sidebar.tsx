import { NavLink } from "react-router-dom";
import { navigationItems } from "../../data/navigation";
import { useGameStore } from "../../store/gameStore";
import { formatPhase } from "../../utils/format";
import { cx } from "../../utils/classNames";

export default function Sidebar() {
  const week = useGameStore((state) => state.game.week);
  const macro = useGameStore((state) => state.game.macro);

  return (
    <aside className="glass-panel glass-highlight relative m-6 mr-0 hidden w-64 flex-col gap-6 rounded-3xl p-6 lg:flex">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">MarketCraft</p>
          <p className="font-display text-2xl text-gradient">Console</p>
        </div>
        <span className="rounded-full border border-border/70 bg-surface/70 px-2 py-1 text-[10px] font-semibold text-muted">
          Settimana {week}
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-3">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cx(
                "group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2 transition",
                "hover:border-border/70 hover:bg-surface/70 hover:shadow-soft",
                isActive ? "border-border/90 bg-surface/80 shadow-soft" : ""
              )
            }
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/80 text-accent shadow-soft transition group-hover:scale-[1.02]">
              {item.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-text">{item.label}</p>
              <p className="text-xs text-muted">{item.description}</p>
            </div>
          </NavLink>
        ))}
      </nav>

      <div className="glass-panel rounded-2xl px-4 py-3 text-xs text-muted">
        <p className="font-semibold text-text">Stato mercato</p>
        <p>{formatPhase(macro.phase)} · Sentiment {macro.sentiment > 0 ? "positivo" : "prudente"}</p>
      </div>
    </aside>
  );
}
