import { clamp } from "./math";
import type { GameState, Position } from "../types/engine";

export type TradeResult = {
  state: GameState;
  error?: string;
};

function getAssetPrice(state: GameState, assetId: string): number | undefined {
  const stock = state.assets.stocks.find((item) => item.id === assetId);
  if (stock) return stock.price;
  const bond = state.assets.bonds.find((item) => item.id === assetId);
  if (bond) return bond.price;
  const etf = state.assets.etfs.find((item) => item.id === assetId);
  if (etf) return etf.price;
  const commodity = state.assets.commodities.find((item) => item.id === assetId);
  if (commodity) return commodity.price;
  return undefined;
}

function updatePosition(
  positions: Position[],
  assetId: string,
  assetClass: Position["assetClass"],
  quantity: number,
  price: number
): Position[] {
  const existing = positions.find((pos) => pos.assetId === assetId);
  if (!existing) {
    if (quantity <= 0) {
      return positions;
    }
    return [...positions, { assetId, assetClass, quantity, avgPrice: price }];
  }

  const totalQuantity = existing.quantity + quantity;
  if (totalQuantity <= 0) {
    return positions.filter((pos) => pos.assetId !== assetId);
  }

  const avgPrice =
    quantity > 0
      ? (existing.avgPrice * existing.quantity + price * quantity) / Math.max(totalQuantity, 1)
      : existing.avgPrice;

  return positions.map((pos) =>
    pos.assetId === assetId
      ? {
          ...pos,
          quantity: totalQuantity,
          avgPrice: totalQuantity > 0 ? avgPrice : pos.avgPrice,
        }
      : pos
  );
}

function computePortfolioValue(state: GameState) {
  const total = state.portfolio.positions.reduce((sum, position) => {
    const price = getAssetPrice(state, position.assetId) ?? 0;
    return sum + price * position.quantity;
  }, 0);

  return total;
}

export function buyAsset(
  state: GameState,
  assetId: string,
  assetClass: Position["assetClass"],
  quantity: number,
  allowLeverage: boolean
): TradeResult {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { state, error: "Inserisci una quantita valida." };
  }

  const price = getAssetPrice(state, assetId);
  if (!price) {
    return { state, error: "Asset non trovato." };
  }

  const cost = price * quantity;
  let cash = state.portfolio.cash;
  let debt = state.portfolio.debt;

  const portfolioValue = computePortfolioValue(state);
  const equity = cash + portfolioValue - debt;
  const maxDebt = allowLeverage ? clamp(equity * 0.5, 0, 100000) : 0;

  if (cost > cash) {
    const needed = cost - cash;
    if (!allowLeverage || debt + needed > maxDebt) {
      return { state, error: "Liquidita insufficiente per completare l'operazione." };
    }
    debt += needed;
    cash = 0;
  } else {
    cash -= cost;
  }

  const positions = updatePosition(state.portfolio.positions, assetId, assetClass, quantity, price);

  return {
    state: {
      ...state,
      portfolio: {
        ...state.portfolio,
        cash,
        debt,
        positions,
      },
    },
  };
}

export function sellAsset(
  state: GameState,
  assetId: string,
  assetClass: Position["assetClass"],
  quantity: number
): TradeResult {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { state, error: "Inserisci una quantita valida." };
  }

  const price = getAssetPrice(state, assetId);
  if (!price) {
    return { state, error: "Asset non trovato." };
  }

  const existing = state.portfolio.positions.find((pos) => pos.assetId === assetId);
  if (!existing || existing.quantity < quantity) {
    return { state, error: "Quantita non disponibile in portafoglio." };
  }

  const proceeds = price * quantity;
  const pnl = (price - existing.avgPrice) * quantity;

  let cash = state.portfolio.cash;
  let debt = state.portfolio.debt;

  if (debt > 0) {
    const payoff = Math.min(debt, proceeds);
    debt -= payoff;
    cash += proceeds - payoff;
  } else {
    cash += proceeds;
  }

  const positions = updatePosition(state.portfolio.positions, assetId, assetClass, -quantity, price);

  return {
    state: {
      ...state,
      portfolio: {
        ...state.portfolio,
        cash,
        debt,
        positions,
        realizedPnl: state.portfolio.realizedPnl + pnl,
      },
    },
  };
}
