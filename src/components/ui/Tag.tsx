import type { ReactNode } from "react";
import { cx } from "../../utils/classNames";

type TagProps = {
  children: ReactNode;
  tone?: "neutral" | "positive" | "negative" | "warning";
};

const toneStyles: Record<NonNullable<TagProps["tone"]>, string> = {
  neutral: "bg-surface/70 text-muted",
  positive: "bg-emerald-500/20 text-emerald-600",
  negative: "bg-rose-500/20 text-rose-600",
  warning: "bg-amber-400/20 text-amber-700",
};

export default function Tag({ children, tone = "neutral" }: TagProps) {
  return (
    <span
      className={cx(
        "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] lg:px-3 lg:text-[11px]",
        toneStyles[tone]
      )}
    >
      {children}
    </span>
  );
}
