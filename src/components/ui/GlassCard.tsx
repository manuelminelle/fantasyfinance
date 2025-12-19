import type { ReactNode } from "react";
import { cx } from "../../utils/classNames";

type GlassCardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export default function GlassCard({ title, subtitle, children, className }: GlassCardProps) {
  return (
    <section
      className={cx(
        "glass-panel glass-highlight rounded-2xl p-4 sm:p-5 lg:rounded-3xl lg:p-6",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-text">{title}</h3>}
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
