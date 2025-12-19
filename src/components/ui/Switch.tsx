import { cx } from "../../utils/classNames";

type SwitchProps = {
  checked: boolean;
  onChange?: () => void;
  label: string;
  description?: string;
};

export default function Switch({ checked, onChange, label, description }: SwitchProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border/60 bg-surface/70 px-4 py-3 text-left"
      role="switch"
      aria-checked={checked}
    >
      <div>
        <p className="text-sm font-semibold text-text">{label}</p>
        {description && <p className="text-xs text-muted">{description}</p>}
      </div>
      <span
        className={cx(
          "flex h-7 w-12 items-center rounded-full border border-border/70 px-1 transition",
          checked ? "bg-accent/70" : "bg-surface/80"
        )}
        aria-hidden="true"
      >
        <span
          className={cx(
            "h-5 w-5 rounded-full bg-white shadow-soft transition",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </span>
    </button>
  );
}
