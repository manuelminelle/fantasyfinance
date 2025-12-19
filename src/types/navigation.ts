import type { ReactNode } from "react";

export type NavItem = {
  label: string;
  path: string;
  description: string;
  icon: ReactNode;
};
