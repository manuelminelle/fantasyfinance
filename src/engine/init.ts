import { bondSeeds, commoditySeeds, etfSeeds, stockSeeds } from "./data";
import { computeFairValue } from "./valuation";
import type { GameState } from "../types/engine";

const GAME_VERSION = "0.1.0";

export function createInitialGameState(seed: number): GameState {
  const stocks = stockSeeds.map((seedItem) => {
    const revenue = seedItem.fundamentals.revenue;
    const margin = seedItem.fundamentals.margin;
    const costs = revenue * (1 - margin);
    const fairValue = computeFairValue({
      revenue,
      costs,
      margin,
      debt: seedItem.fundamentals.debt,
      growth: seedItem.fundamentals.growth,
      risk: seedItem.fundamentals.risk,
      cash: seedItem.fundamentals.cash,
      capex: seedItem.fundamentals.capex,
    });

    return {
      id: seedItem.id,
      name: seedItem.name,
      sector: seedItem.sector,
      price: seedItem.price,
      fairValue,
      weeklyChange: 0,
      volatility: seedItem.volatility,
      sentiment: seedItem.sentiment,
      fundamentals: {
        revenue,
        costs,
        margin,
        debt: seedItem.fundamentals.debt,
        growth: seedItem.fundamentals.growth,
        risk: seedItem.fundamentals.risk,
        cash: seedItem.fundamentals.cash,
        capex: seedItem.fundamentals.capex,
      },
    };
  });

  const bonds = bondSeeds.map((seedItem) => ({
    id: seedItem.id,
    name: seedItem.name,
    duration: seedItem.duration,
    coupon: seedItem.coupon,
    price: seedItem.price,
    yield: seedItem.coupon,
    weeklyChange: 0,
    volatility: seedItem.volatility,
  }));

  const etfs = etfSeeds.map((seedItem) => ({
    id: seedItem.id,
    name: seedItem.name,
    sector: seedItem.sector,
    price: seedItem.price,
    fairValue: seedItem.price,
    weeklyChange: 0,
    volatility: seedItem.volatility,
    holdings: seedItem.holdings,
    trackingFactor: seedItem.trackingFactor,
  }));

  const commodities = commoditySeeds.map((seedItem) => ({
    id: seedItem.id,
    name: seedItem.name,
    basePrice: seedItem.price,
    anchor: seedItem.price,
    price: seedItem.price,
    weeklyChange: 0,
    volatility: seedItem.volatility,
    trend: 0,
  }));

  return {
    gameVersion: GAME_VERSION,
    seed,
    rngState: seed,
    week: 12,
    macro: {
      phase: "expansion",
      rate: 4.0,
      inflation: 3.2,
      unemployment: 5.6,
      gdp: 2.1,
      sentiment: 0.22,
    },
    assets: {
      stocks,
      bonds,
      etfs,
      commodities,
    },
    portfolio: {
      cash: 10000,
      debt: 0,
      positions: [],
      realizedPnl: 0,
    },
    events: [],
    newsFeed: [],
    netWorthHistory: [{ week: 12, value: 10000 }],
  };
}
