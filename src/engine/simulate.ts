import { clamp } from "./math";
import { computeFairValue } from "./valuation";
import { rngGaussian, rngPick, rngRange, rngWeightedPick } from "./rng";
import type {
  BondAsset,
  CommodityAsset,
  EtfAsset,
  GameEvent,
  GameState,
  MacroPhase,
  MacroState,
  NewsItem,
  Sector,
  StockAsset,
} from "../types/engine";

const sectors: Sector[] = ["Tech", "Energy", "Healthcare", "Consumer", "Industrials"];


type EventTemplate = {
  id: string;
  type: string;
  weight: number;
  tone: "positive" | "negative" | "neutral";
  title: string;
  summary: string;
  sector?: Sector;
  sectorSentiment?: number;
  macroShift?: Partial<Pick<MacroState, "rate" | "inflation" | "unemployment" | "gdp" | "sentiment">>;
  commodityId?: string;
  commodityShock?: number;
};

const eventTemplates: EventTemplate[] = [
  {
    id: "earnings-beat",
    type: "earnings",
    weight: 3,
    tone: "positive",
    title: "Utili sopra le attese nel settore {sector}",
    summary: "Margini migliori del previsto alimentano il sentiment e la liquidita.",
    sectorSentiment: 0.25,
  },
  {
    id: "earnings-miss",
    type: "earnings",
    weight: 2,
    tone: "negative",
    title: "Utili sotto le attese nel settore {sector}",
    summary: "Ricavi deludenti e guidance prudente frenano gli acquisti.",
    sectorSentiment: -0.22,
  },
  {
    id: "regulation",
    type: "regulation",
    weight: 2,
    tone: "negative",
    title: "Regolazione piu severa su {sector}",
    summary: "Costi di compliance in aumento e roadmap piu lenta.",
    sectorSentiment: -0.18,
  },
  {
    id: "breakthrough",
    type: "innovation",
    weight: 2,
    tone: "positive",
    title: "Nuova tecnologia accelera produttivita in {sector}",
    summary: "Efficienza operativa e domanda enterprise spingono le valutazioni.",
    sectorSentiment: 0.2,
  },
  {
    id: "geopolitical",
    type: "macro",
    weight: 1.5,
    tone: "negative",
    title: "Shock geopolitico rallenta i commerci",
    summary: "Rischio logistico in aumento e volatilita su materie prime.",
    macroShift: { inflation: 0.12, sentiment: -0.08, gdp: -0.15 },
  },
  {
    id: "central-bank-pause",
    type: "macro",
    weight: 1.8,
    tone: "positive",
    title: "Banche centrali segnalano pausa sui tassi",
    summary: "Condizioni finanziarie piu morbide sostengono la domanda di rischio.",
    macroShift: { rate: -0.12, sentiment: 0.06 },
  },
  {
    id: "oil-shock",
    type: "commodity",
    weight: 1.2,
    tone: "negative",
    title: "Supply shock sul petrolio",
    summary: "Interruzioni logistiche spingono il barile e aumentano l'incertezza.",
    sector: "Energy",
    sectorSentiment: 0.15,
    commodityId: "cmd-oil",
    commodityShock: 0.08,
    macroShift: { inflation: 0.1, sentiment: -0.04 },
  },
  {
    id: "gold-flight",
    type: "commodity",
    weight: 1,
    tone: "positive",
    title: "Domanda rifugio sostiene l'oro",
    summary: "Investitori cercano stabilita mentre la volatilita cresce.",
    commodityId: "cmd-gold",
    commodityShock: 0.06,
    macroShift: { sentiment: -0.02 },
  },
];

const sectorSensitivity: Record<
  Sector,
  { gdp: number; inflation: number; rate: number; sentiment: number }
> = {
  Tech: { gdp: 0.5, inflation: -0.25, rate: -0.35, sentiment: 0.4 },
  Energy: { gdp: 0.25, inflation: 0.4, rate: -0.1, sentiment: 0.2 },
  Healthcare: { gdp: 0.2, inflation: -0.1, rate: -0.15, sentiment: 0.15 },
  Consumer: { gdp: 0.45, inflation: -0.3, rate: -0.2, sentiment: 0.3 },
  Industrials: { gdp: 0.5, inflation: -0.15, rate: -0.2, sentiment: 0.25 },
};

const phaseVolatility: Record<MacroPhase, number> = {
  expansion: 0.9,
  slowdown: 1.05,
  recession: 1.25,
  recovery: 1.0,
};

const phaseGrowth: Record<MacroPhase, number> = {
  expansion: 0.02,
  slowdown: -0.005,
  recession: -0.035,
  recovery: 0.015,
};

type CommodityProfile = {
  anchorMin: number;
  anchorMax: number;
  floor: number;
  meanReversion: number;
  trendDecay: number;
  shockTrend: number;
  shockAnchor: number;
  volatilityScale: number;
  sensitivity: {
    inflation: number;
    gdp: number;
    realRate: number;
    sentiment: number;
    recession: number;
  };
};

const commodityProfiles: Record<string, CommodityProfile> = {
  "cmd-gold": {
    anchorMin: 0.6,
    anchorMax: 2.4,
    floor: 0.5,
    meanReversion: 0.25,
    trendDecay: 0.55,
    shockTrend: 0.6,
    shockAnchor: 0.3,
    volatilityScale: 0.9,
    sensitivity: {
      inflation: 0.0022,
      gdp: 0.0,
      realRate: -0.003,
      sentiment: -0.012,
      recession: 0.01,
    },
  },
  "cmd-oil": {
    anchorMin: 0.5,
    anchorMax: 2.1,
    floor: 0.35,
    meanReversion: 0.2,
    trendDecay: 0.5,
    shockTrend: 0.85,
    shockAnchor: 0.4,
    volatilityScale: 1.1,
    sensitivity: {
      inflation: 0.0012,
      gdp: 0.0022,
      realRate: -0.0008,
      sentiment: 0.004,
      recession: -0.018,
    },
  },
};

const defaultCommodityProfile: CommodityProfile = {
  anchorMin: 0.5,
  anchorMax: 2.0,
  floor: 0.4,
  meanReversion: 0.2,
  trendDecay: 0.5,
  shockTrend: 0.6,
  shockAnchor: 0.3,
  volatilityScale: 1,
  sensitivity: {
    inflation: 0.0015,
    gdp: 0.0015,
    realRate: -0.001,
    sentiment: 0,
    recession: -0.01,
  },
};

function getCommodityProfile(id: string) {
  return commodityProfiles[id] ?? defaultCommodityProfile;
}

function advanceMacro(macro: MacroState, rngState: number) {
  let nextState = rngState;
  const noiseRate = rngRange(nextState, -0.08, 0.08);
  nextState = noiseRate.state;
  const noiseInflation = rngRange(nextState, -0.1, 0.1);
  nextState = noiseInflation.state;
  const noiseUnemployment = rngRange(nextState, -0.08, 0.08);
  nextState = noiseUnemployment.state;
  const noiseGdp = rngRange(nextState, -0.15, 0.15);
  nextState = noiseGdp.state;

  const drift = phaseGrowth[macro.phase];

  let rate = clamp(macro.rate + drift * 0.4 + noiseRate.value, 0, 8);
  let inflation = clamp(macro.inflation + drift * 0.5 + noiseInflation.value, 0, 7);
  let unemployment = clamp(macro.unemployment - drift * 0.8 + noiseUnemployment.value, 3, 12);
  let gdp = clamp(macro.gdp + drift + noiseGdp.value, -3.5, 4.5);

  const phaseRoll = rngRange(nextState, 0, 1);
  nextState = phaseRoll.state;

  let phase = macro.phase;
  if (phase === "expansion" && phaseRoll.value < 0.18) {
    phase = "slowdown";
  } else if (phase === "slowdown" && phaseRoll.value < 0.22) {
    phase = gdp < 1.2 ? "recession" : "recovery";
  } else if (phase === "recession" && phaseRoll.value < 0.35) {
    phase = "recovery";
  } else if (phase === "recovery" && phaseRoll.value < 0.3) {
    phase = "expansion";
  }

  const sentimentNoise = rngRange(nextState, -0.08, 0.08);
  nextState = sentimentNoise.state;
  const sentiment = clamp(
    macro.sentiment + gdp * 0.05 - unemployment * 0.02 - rate * 0.015 + sentimentNoise.value,
    -1,
    1
  );

  return {
    macro: {
      phase,
      rate,
      inflation,
      unemployment,
      gdp,
      sentiment,
    },
    state: nextState,
  };
}

function buildImpactLabel(template: EventTemplate, sector?: Sector) {
  if (template.commodityId === "cmd-oil") {
    return "Petrolio in rialzo";
  }
  if (template.commodityId === "cmd-gold") {
    return "Oro sostenuto";
  }
  if (sector) {
    return `${sector} ${template.tone === "positive" ? "in rialzo" : "sotto pressione"}`;
  }
  return template.tone === "positive" ? "Mercato in rialzo" : "Mercato sotto pressione";
}

function generateEvents(week: number, rngState: number) {
  let nextState = rngState;
  const countRoll = rngRange(nextState, 0, 1);
  nextState = countRoll.state;
  const eventCount = countRoll.value > 0.72 ? 2 : 1;

  const sectorSentiment: Record<Sector, number> = {
    Tech: 0,
    Energy: 0,
    Healthcare: 0,
    Consumer: 0,
    Industrials: 0,
  };
  const commodityShocks: Record<string, number> = {};
  const macroShift: Partial<MacroState> = {
    rate: 0,
    inflation: 0,
    unemployment: 0,
    gdp: 0,
    sentiment: 0,
  };

  const events: GameEvent[] = [];
  const news: NewsItem[] = [];

  for (let i = 0; i < eventCount; i += 1) {
    const templatePick = rngWeightedPick(nextState, eventTemplates);
    nextState = templatePick.state;

    let sector = templatePick.value.sector;
    if (templatePick.value.title.includes("{sector}") && !sector) {
      const sectorPick = rngPick(nextState, sectors);
      sector = sectorPick.value;
      nextState = sectorPick.state;
    }

    const title = templatePick.value.title.replace("{sector}", sector ?? "mercato");
    const summary = templatePick.value.summary.replace("{sector}", sector ?? "mercato");

    if (sector && templatePick.value.sectorSentiment) {
      sectorSentiment[sector] += templatePick.value.sectorSentiment;
    }

    if (templatePick.value.macroShift) {
      macroShift.rate = (macroShift.rate ?? 0) + (templatePick.value.macroShift.rate ?? 0);
      macroShift.inflation = (macroShift.inflation ?? 0) + (templatePick.value.macroShift.inflation ?? 0);
      macroShift.unemployment =
        (macroShift.unemployment ?? 0) + (templatePick.value.macroShift.unemployment ?? 0);
      macroShift.gdp = (macroShift.gdp ?? 0) + (templatePick.value.macroShift.gdp ?? 0);
      macroShift.sentiment =
        (macroShift.sentiment ?? 0) + (templatePick.value.macroShift.sentiment ?? 0);
    }

    if (templatePick.value.commodityId && templatePick.value.commodityShock) {
      commodityShocks[templatePick.value.commodityId] =
        (commodityShocks[templatePick.value.commodityId] ?? 0) + templatePick.value.commodityShock;
    }

    const id = `ev-${week}-${templatePick.value.id}-${i}`;

    events.push({
      id,
      type: templatePick.value.type,
      title,
      summary,
      sector,
      tone: templatePick.value.tone,
    });

    news.push({
      id,
      week,
      title,
      summary,
      impact: buildImpactLabel(templatePick.value, sector),
      tone: templatePick.value.tone,
    });
  }

  return {
    events,
    news,
    sectorSentiment,
    commodityShocks,
    macroShift,
    state: nextState,
  };
}

function applyMacroShift(macro: MacroState, shift: Partial<MacroState>) {
  return {
    phase: macro.phase,
    rate: clamp(macro.rate + (shift.rate ?? 0), 0, 8),
    inflation: clamp(macro.inflation + (shift.inflation ?? 0), 0, 7),
    unemployment: clamp(macro.unemployment + (shift.unemployment ?? 0), 3, 12),
    gdp: clamp(macro.gdp + (shift.gdp ?? 0), -3.5, 4.5),
    sentiment: clamp(macro.sentiment + (shift.sentiment ?? 0), -1, 1),
  };
}

function updateStocks(
  stocks: StockAsset[],
  macro: MacroState,
  sectorSentiment: Record<Sector, number>,
  rngState: number
) {
  let nextState = rngState;
  const updated: StockAsset[] = [];

  for (const stock of stocks) {
    const sensitivity = sectorSensitivity[stock.sector];
    const macroImpulse =
      macro.gdp * sensitivity.gdp + macro.inflation * sensitivity.inflation + macro.rate * sensitivity.rate;

    const growthNoise = rngRange(nextState, -0.03, 0.05);
    nextState = growthNoise.state;
    const marginNoise = rngRange(nextState, -0.015, 0.015);
    nextState = marginNoise.state;
    const debtNoise = rngRange(nextState, -0.03, 0.04);
    nextState = debtNoise.state;
    const riskNoise = rngRange(nextState, -0.02, 0.02);
    nextState = riskNoise.state;

    const sectorPulse = sectorSentiment[stock.sector] ?? 0;
    const sentiment = clamp(
      stock.sentiment + sectorPulse + macro.sentiment * sensitivity.sentiment,
      -1,
      1
    );

    const growth = clamp(stock.fundamentals.growth + growthNoise.value + phaseGrowth[macro.phase] + macroImpulse * 0.002, -0.08, 0.18);
    const margin = clamp(stock.fundamentals.margin + marginNoise.value - macro.inflation * 0.001, 0.08, 0.45);
    const debt = clamp(stock.fundamentals.debt * (1 + debtNoise.value), 120, 2600);
    const risk = clamp(stock.fundamentals.risk + riskNoise.value + (macro.phase === "recession" ? 0.02 : -0.005), 0.12, 0.6);

    const revenue = clamp(stock.fundamentals.revenue * (1 + growth), 800, 9000);
    const costs = revenue * (1 - margin);
    const cash = clamp(stock.fundamentals.cash * (1 + growth * 0.4), 200, 2200);
    const capex = clamp(stock.fundamentals.capex * (1 + growth * 0.3), 120, 1200);

    const fundamentals = {
      revenue,
      costs,
      margin,
      debt,
      growth,
      risk,
      cash,
      capex,
    };

    const fairValue = computeFairValue(fundamentals);
    const gaussian = rngGaussian(nextState, 0, stock.volatility * phaseVolatility[macro.phase]);
    nextState = gaussian.state;

    const gap = (fairValue - stock.price) / stock.price;
    const drift = gap * 0.25 + sentiment * 0.05 + macroImpulse * 0.001;
    const change = clamp(drift + gaussian.value, -0.2, 0.2);
    const price = clamp(stock.price * (1 + change), 4, 320);
    const weeklyChange = (price - stock.price) / stock.price;

    updated.push({
      ...stock,
      price,
      fairValue,
      weeklyChange,
      sentiment,
      fundamentals,
    });
  }

  return { stocks: updated, state: nextState };
}

function updateBonds(bonds: BondAsset[], macro: MacroState, prevMacro: MacroState, rngState: number) {
  let nextState = rngState;
  const updated: BondAsset[] = [];
  const rateChange = macro.rate - prevMacro.rate;

  for (const bond of bonds) {
    const gaussian = rngGaussian(nextState, 0, bond.volatility);
    nextState = gaussian.state;
    const durationImpact = -bond.duration * rateChange * 0.012;
    const change = clamp(durationImpact + gaussian.value, -0.08, 0.08);
    const price = clamp(bond.price * (1 + change), 70, 130);
    const weeklyChange = (price - bond.price) / bond.price;
    const yieldValue = clamp((bond.coupon / price) * 100 + macro.rate * 0.25, 0, 10);

    updated.push({
      ...bond,
      price,
      weeklyChange,
      yield: yieldValue,
    });
  }

  return { bonds: updated, state: nextState };
}

function updateEtfs(etfs: EtfAsset[], stocks: StockAsset[], rngState: number) {
  let nextState = rngState;
  const updated: EtfAsset[] = [];
  const priceMap = new Map(stocks.map((stock) => [stock.id, stock.price]));

  for (const etf of etfs) {
    const prices = etf.holdings
      .map((id) => priceMap.get(id))
      .filter((value): value is number => typeof value === "number");
    const average = prices.reduce((sum, value) => sum + value, 0) / Math.max(prices.length, 1);
    const target = clamp(average * etf.trackingFactor, 18, 220);

    const gaussian = rngGaussian(nextState, 0, etf.volatility);
    nextState = gaussian.state;
    const drift = ((target - etf.price) / etf.price) * 0.3;
    const change = clamp(drift + gaussian.value, -0.12, 0.12);
    const price = clamp(etf.price * (1 + change), 18, 220);
    const weeklyChange = (price - etf.price) / etf.price;

    updated.push({
      ...etf,
      price,
      fairValue: target,
      weeklyChange,
    });
  }

  return { etfs: updated, state: nextState };
}

function updateCommodities(
  commodities: CommodityAsset[],
  macro: MacroState,
  commodityShocks: Record<string, number>,
  rngState: number
) {
  let nextState = rngState;
  const updated: CommodityAsset[] = [];
  const realRate = macro.rate - macro.inflation;

  for (const commodity of commodities) {
    const profile = getCommodityProfile(commodity.id);
    const shock = commodityShocks[commodity.id] ?? 0;
    const basePrice = commodity.basePrice || commodity.price;
    const anchor = commodity.anchor || basePrice;

    const macroDrift =
      macro.inflation * profile.sensitivity.inflation +
      macro.gdp * profile.sensitivity.gdp +
      realRate * profile.sensitivity.realRate +
      macro.sentiment * profile.sensitivity.sentiment +
      (macro.phase === "recession" ? profile.sensitivity.recession : 0);

    const anchorDrift = clamp(macroDrift * 0.6 + shock * profile.shockAnchor, -0.08, 0.1);
    const nextAnchor = clamp(anchor * (1 + anchorDrift), basePrice * profile.anchorMin, basePrice * profile.anchorMax);

    const gap = (nextAnchor - commodity.price) / Math.max(commodity.price, 1);
    const meanReversion = clamp(gap, -0.35, 0.35) * profile.meanReversion;
    const trend = clamp(
      commodity.trend * profile.trendDecay + macroDrift + shock * profile.shockTrend,
      -0.18,
      0.22
    );

    const gaussian = rngGaussian(nextState, 0, commodity.volatility * profile.volatilityScale);
    nextState = gaussian.state;
    const change = clamp(meanReversion + trend + gaussian.value, -0.2, 0.24);
    const floor = Math.max(5, basePrice * profile.floor);
    const price = Math.max(floor, commodity.price * (1 + change));
    const weeklyChange = (price - commodity.price) / commodity.price;

    updated.push({
      ...commodity,
      price,
      weeklyChange,
      trend,
      anchor: nextAnchor,
    });
  }

  return { commodities: updated, state: nextState };
}

function computeNetWorth(state: GameState, cash: number) {
  const priceMap = new Map<string, number>();
  for (const stock of state.assets.stocks) priceMap.set(stock.id, stock.price);
  for (const bond of state.assets.bonds) priceMap.set(bond.id, bond.price);
  for (const etf of state.assets.etfs) priceMap.set(etf.id, etf.price);
  for (const commodity of state.assets.commodities) priceMap.set(commodity.id, commodity.price);

  const positionsValue = state.portfolio.positions.reduce((sum, position) => {
    const price = priceMap.get(position.assetId) ?? 0;
    return sum + price * position.quantity;
  }, 0);

  return cash + positionsValue - state.portfolio.debt;
}

export function simulateTurn(state: GameState): GameState {
  let rngState = state.rngState;

  const macroStep = advanceMacro(state.macro, rngState);
  rngState = macroStep.state;

  const eventStep = generateEvents(state.week + 1, rngState);
  rngState = eventStep.state;

  const macro = applyMacroShift(macroStep.macro, eventStep.macroShift);

  const stocksStep = updateStocks(state.assets.stocks, macro, eventStep.sectorSentiment, rngState);
  rngState = stocksStep.state;

  const bondsStep = updateBonds(state.assets.bonds, macro, state.macro, rngState);
  rngState = bondsStep.state;

  const etfStep = updateEtfs(state.assets.etfs, stocksStep.stocks, rngState);
  rngState = etfStep.state;

  const commodityStep = updateCommodities(state.assets.commodities, macro, eventStep.commodityShocks, rngState);
  rngState = commodityStep.state;

  const cashYield = state.portfolio.cash * (macro.rate / 5200);
  const cash = clamp(state.portfolio.cash + cashYield, 0, 1000000);
  const netWorth = computeNetWorth(
    {
      ...state,
      assets: {
        stocks: stocksStep.stocks,
        bonds: bondsStep.bonds,
        etfs: etfStep.etfs,
        commodities: commodityStep.commodities,
      },
    },
    cash
  );

  const netWorthHistory = [...state.netWorthHistory, { week: state.week + 1, value: netWorth }].slice(-24);

  return {
    ...state,
    week: state.week + 1,
    rngState,
    macro,
    assets: {
      stocks: stocksStep.stocks,
      bonds: bondsStep.bonds,
      etfs: etfStep.etfs,
      commodities: commodityStep.commodities,
    },
    portfolio: {
      ...state.portfolio,
      cash,
    },
    events: eventStep.events,
    newsFeed: [...eventStep.news, ...state.newsFeed].slice(0, 20),
    netWorthHistory,
  };
}
