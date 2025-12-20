import { useGameStore } from "../../store/gameStore";
import { useUiStore } from "../../store/uiStore";
import { formatPhase } from "../../utils/format";
import ThemeToggle from "../ui/ThemeToggle";
import { playSfx } from "../../services/sfx";

export default function TopBar() {
  const week = useGameStore((state) => state.game.week);
  const phase = useGameStore((state) => state.game.macro.phase);
  const endTurn = useGameStore((state) => state.endTurn);
  const displayName = useUiStore((state) => state.displayName);

  const handleEndTurn = () => {
    endTurn();
    playSfx("confirm");
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs text-muted sm:text-sm">Settimana {week} · Ciclo: {formatPhase(phase)}</p>
        <h1 className="font-display text-2xl text-text sm:text-3xl">
          {displayName ? `Ciao, ${displayName}` : "Ciao, Stratega"}
        </h1>
      </div>
      <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start">
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
