import { create } from "zustand";
import { createInitialGameState } from "../engine/init";
import { buyAsset, sellAsset } from "../engine/portfolio";
import { simulateTurn } from "../engine/simulate";
import type { GameState, Position } from "../types/engine";

const DEFAULT_SEED = 42817;

type GameStore = {
  game: GameState;
  tradeMessage: { type: "success" | "error"; text: string } | null;
  endTurn: () => void;
  resetGame: (seed?: number) => void;
  hydrateGame: (game: GameState) => void;
  buy: (assetId: string, assetClass: Position["assetClass"], quantity: number, allowLeverage: boolean) => string | undefined;
  sell: (assetId: string, assetClass: Position["assetClass"], quantity: number) => string | undefined;
  clearTradeMessage: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
  game: createInitialGameState(DEFAULT_SEED),
  tradeMessage: null,
  endTurn: () => set((state) => ({ game: simulateTurn(state.game) })),
  resetGame: (seed) => set(() => ({ game: createInitialGameState(seed ?? DEFAULT_SEED) })),
  hydrateGame: (game) => set(() => ({ game, tradeMessage: null })),
  buy: (assetId, assetClass, quantity, allowLeverage) => {
    let error: string | undefined;
    set((state) => {
      const result = buyAsset(state.game, assetId, assetClass, quantity, allowLeverage);
      error = result.error;
      return {
        game: result.state,
        tradeMessage: result.error
          ? { type: "error", text: result.error }
          : { type: "success", text: "Acquisto completato." },
      };
    });
    return error;
  },
  sell: (assetId, assetClass, quantity) => {
    let error: string | undefined;
    set((state) => {
      const result = sellAsset(state.game, assetId, assetClass, quantity);
      error = result.error;
      return {
        game: result.state,
        tradeMessage: result.error
          ? { type: "error", text: result.error }
          : { type: "success", text: "Vendita completata." },
      };
    });
    return error;
  },
  clearTradeMessage: () => set({ tradeMessage: null }),
}));
