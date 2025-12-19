import {
  IconDashboard,
  IconMarkets,
  IconNews,
  IconPortfolio,
  IconResearch,
  IconScenario,
  IconSettings,
  IconBook,
} from "../components/icons";
import type { NavItem } from "../types/navigation";

export const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/",
    description: "Sintesi delle performance settimanali",
    icon: <IconDashboard className="h-5 w-5" />,
  },
  {
    label: "Mercati",
    path: "/mercati",
    description: "Prezzi, volatilita e trend",
    icon: <IconMarkets className="h-5 w-5" />,
  },
  {
    label: "Portafoglio",
    path: "/portafoglio",
    description: "Posizioni e P&L in tempo reale",
    icon: <IconPortfolio className="h-5 w-5" />,
  },
  {
    label: "Notizie",
    path: "/notizie",
    description: "Timeline eventi e impatti",
    icon: <IconNews className="h-5 w-5" />,
  },
  {
    label: "Ricerca",
    path: "/ricerca",
    description: "Analisi fondamentali e rischio",
    icon: <IconResearch className="h-5 w-5" />,
  },
  {
    label: "Impostazioni",
    path: "/impostazioni",
    description: "Audio, modalita e preferenze",
    icon: <IconSettings className="h-5 w-5" />,
  },
  {
    label: "Scenario",
    path: "/scenario",
    description: "Preset difficolta e simulazione",
    icon: <IconScenario className="h-5 w-5" />,
  },
  {
    label: "Regole",
    path: "/regole",
    description: "Obiettivo, turni e risk playbook",
    icon: <IconBook className="h-5 w-5" />,
  },
];
