import { clamp } from "./math";
import type { Fundamentals } from "../types/engine";

export function computeFairValue(fundamentals: Fundamentals): number {
  const earnings = fundamentals.revenue * fundamentals.margin;
  const quality = clamp(1 + fundamentals.growth * 3 - fundamentals.risk * 0.6, 0.6, 1.6);
  const balance = clamp((fundamentals.cash - fundamentals.debt * 0.3) * 0.002, -12, 18);
  return clamp(earnings * 0.02 * quality + balance, 6, 260);
}
