import { useGameStore } from "../../store/gameStore";
import { formatPhase } from "../../utils/format";
import ThemeToggle from "../ui/ThemeToggle";
import { playSfx } from "../../services/sfx";

export default function TopBar() {
  const week = useGameStore((state) => state.game.week);
  const phase = useGameStore((state) => state.game.macro.phase);
  const endTurn = useGameStore((state) => state.endTurn);

  const handleEndTurn = () => {
    endTurn();
    playSfx("confirm");
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs text-muted sm:text-sm">Settimana {week} · Ciclo: {formatPhase(phase)}</p>
        <h1 className="font-display text-2xl text-text sm:text-3xl">Benvenuto, Stratega</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleEndTurn}
          className="glass-panel glass-highlight rounded-full px-4 py-2 text-xs font-semibold text-text transition hover:-translate-y-0.5 hover:shadow-soft sm:text-sm"
        >
          Fine settimana
        </button>
        <div className="lg:hidden">
          <ThemeToggle compact />
        </div>
        <div className="hidden lg:block">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
