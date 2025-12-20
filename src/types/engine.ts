export type Sector = "Tech" | "Energy" | "Healthcare" | "Consumer" | "Industrials";

export type MacroPhase = "expansion" | "slowdown" | "recession" | "recovery";

export type Fundamentals = {
  revenue: number;
  costs: number;
  margin: number;
  debt: number;
  growth: number;
  risk: number;
  cash: number;
  capex: number;
};

export type StockAsset = {
  id: string;
  name: string;
  sector: Sector;
  price: number;
  fairValue: number;
  weeklyChange: number;
  fundamentals: Fundamentals;
  volatility: number;
  sentiment: number;
};

export type BondAsset = {
  id: string;
  name: string;
  price: number;
  duration: number;
  coupon: number;
  yield: number;
  weeklyChange: number;
  volatility: number;
};

export type EtfAsset = {
  id: string;
  name: string;
  sector: Sector;
  price: number;
  fairValue: number;
  weeklyChange: number;
  volatility: number;
  holdings: string[];
  trackingFactor: number;
};

export type CommodityAsset = {
  id: string;
  name: string;
  basePrice: number;
  anchor: number;
  price: number;
  weeklyChange: number;
  volatility: number;
  trend: number;
};

export type MacroState = {
  phase: MacroPhase;
  rate: number;
  inflation: number;
  unemployment: number;
  gdp: number;
  sentiment: number;
};

export type Position = {
  assetId: string;
  assetClass: "stock" | "bond" | "etf" | "commodity";
  quantity: number;
  avgPrice: number;
};

export type PortfolioState = {
  cash: number;
  debt: number;
  positions: Position[];
  realizedPnl: number;
};

export type GameEvent = {
  id: string;
  type: string;
  title: string;
  summary: string;
  sector?: Sector;
  tone: "positive" | "negative" | "neutral";
};

export type NewsItem = {
  id: string;
  week: number;
  title: string;
  summary: string;
  impact: string;
  tone: "positive" | "negative" | "neutral";
};

export type NetWorthPoint = {
  week: number;
  value: number;
};

export type GameState = {
  gameVersion: string;
  seed: number;
  rngState: number;
  week: number;
  macro: MacroState;
  assets: {
    stocks: StockAsset[];
    bonds: BondAsset[];
    etfs: EtfAsset[];
    commodities: CommodityAsset[];
  };
  portfolio: PortfolioState;
  events: GameEvent[];
  newsFeed: NewsItem[];
  netWorthHistory: NetWorthPoint[];
};
