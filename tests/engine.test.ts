import { describe, expect, it } from "vitest";
import { createInitialGameState } from "../src/engine/init";
import { simulateTurn } from "../src/engine/simulate";

function runTurns(seed: number, turns: number) {
  let state = createInitialGameState(seed);
  for (let i = 0; i < turns; i += 1) {
    state = simulateTurn(state);
  }
  return state;
}

describe("engine determinism", () => {
  it("produce risultati identici con lo stesso seed", () => {
    const stateA = runTurns(1337, 5);
    const stateB = runTurns(1337, 5);

    expect(stateA).toEqual(stateB);
  });

  it("mantiene prezzi finiti e positivi", () => {
    const state = runTurns(9021, 30);

    const assets = [
      ...state.assets.stocks,
      ...state.assets.bonds,
      ...state.assets.etfs,
      ...state.assets.commodities,
    ];

    for (const asset of assets) {
      expect(Number.isFinite(asset.price)).toBe(true);
      expect(asset.price).toBeGreaterThan(0);
    }
  });
});
