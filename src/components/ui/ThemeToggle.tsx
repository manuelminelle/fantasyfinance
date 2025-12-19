import { IconMoon, IconSun } from "../icons";
import { useUiStore } from "../../store/uiStore";
import { cx } from "../../utils/classNames";

type ThemeToggleProps = {
  compact?: boolean;
};

export default function ThemeToggle({ compact }: ThemeToggleProps) {
  const theme = useUiStore((state) => state.theme);
  const toggleTheme = useUiStore((state) => state.toggleTheme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cx(
        "glass-panel glass-highlight flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium",
        "transition hover:-translate-y-0.5 hover:shadow-soft",
        compact ? "px-2 py-2" : ""
      )}
      aria-label="Cambia tema"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface/70 text-accent shadow-soft">
        {theme === "dark" ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
      </span>
      {!compact && (
        <span className="text-sm text-muted">Tema: {theme === "dark" ? "Scuro" : "Chiaro"}</span>
      )}
    </button>
  );
}
