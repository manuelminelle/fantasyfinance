import { NavLink } from "react-router-dom";
import { navigationItems } from "../../data/navigation";
import { cx } from "../../utils/classNames";

export default function MobileNav() {
  return (
    <nav
      className="glass-panel glass-highlight fixed bottom-4 left-4 right-4 z-20 flex items-center gap-2 overflow-x-auto rounded-2xl px-2 py-2 lg:hidden"
      aria-label="Navigazione principale"
    >
      {navigationItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          aria-label={item.label}
          className={({ isActive }) =>
            cx(
              "flex flex-none flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] transition sm:text-xs",
              isActive ? "bg-surface/80 text-text" : "text-muted"
            )
          }
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface/70 text-accent">
            {item.icon}
          </span>
          <span className="hidden sm:block">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
