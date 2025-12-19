import type { MacroPhase } from "../types/engine";

export function formatCurrency(value: number, digits = 0) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits).replace(".", ",")}%`;
}

export function formatSignedPercent(value: number, digits = 1) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${Math.abs(value).toFixed(digits).replace(".", ",")}%`;
}

export function formatPhase(phase: MacroPhase) {
  switch (phase) {
    case "expansion":
      return "Espansione";
    case "slowdown":
      return "Rallentamento";
    case "recession":
      return "Recessione";
    case "recovery":
      return "Ripresa";
    default:
      return "Scenario";
  }
}
