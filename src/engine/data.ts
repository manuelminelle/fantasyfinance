import type { Sector } from "../types/engine";

type StockSeed = {
  id: string;
  name: string;
  sector: Sector;
  price: number;
  volatility: number;
  sentiment: number;
  fundamentals: {
    revenue: number;
    margin: number;
    debt: number;
    growth: number;
    risk: number;
    cash: number;
    capex: number;
  };
};

type BondSeed = {
  id: string;
  name: string;
  duration: number;
  coupon: number;
  price: number;
  volatility: number;
};

type EtfSeed = {
  id: string;
  name: string;
  sector: Sector;
  price: number;
  volatility: number;
  holdings: string[];
  trackingFactor: number;
};

type CommoditySeed = {
  id: string;
  name: string;
  price: number;
  volatility: number;
};

export const stockSeeds: StockSeed[] = [
  {
    id: "stk-aether",
    name: "Aether Tech",
    sector: "Tech",
    price: 128.4,
    volatility: 0.06,
    sentiment: 0.25,
    fundamentals: {
      revenue: 4200,
      margin: 0.28,
      debt: 820,
      growth: 0.11,
      risk: 0.32,
      cash: 1200,
      capex: 520,
    },
  },
  {
    id: "stk-nova",
    name: "Nova Compute",
    sector: "Tech",
    price: 96.7,
    volatility: 0.05,
    sentiment: 0.18,
    fundamentals: {
      revenue: 3600,
      margin: 0.24,
      debt: 640,
      growth: 0.09,
      risk: 0.28,
      cash: 980,
      capex: 430,
    },
  },
  {
    id: "stk-cypher",
    name: "Cypher Labs",
    sector: "Tech",
    price: 74.2,
    volatility: 0.07,
    sentiment: 0.12,
    fundamentals: {
      revenue: 2800,
      margin: 0.31,
      debt: 510,
      growth: 0.13,
      risk: 0.35,
      cash: 760,
      capex: 390,
    },
  },
  {
    id: "stk-horizon",
    name: "Horizon AI",
    sector: "Tech",
    price: 142.1,
    volatility: 0.08,
    sentiment: 0.3,
    fundamentals: {
      revenue: 5100,
      margin: 0.34,
      debt: 980,
      growth: 0.14,
      risk: 0.38,
      cash: 1400,
      capex: 640,
    },
  },
  {
    id: "stk-helios",
    name: "Helios Energy",
    sector: "Energy",
    price: 76.2,
    volatility: 0.05,
    sentiment: -0.05,
    fundamentals: {
      revenue: 6100,
      margin: 0.18,
      debt: 1300,
      growth: 0.05,
      risk: 0.26,
      cash: 890,
      capex: 710,
    },
  },
  {
    id: "stk-boreal",
    name: "Boreal Power",
    sector: "Energy",
    price: 58.4,
    volatility: 0.06,
    sentiment: 0.02,
    fundamentals: {
      revenue: 4400,
      margin: 0.2,
      debt: 990,
      growth: 0.04,
      risk: 0.29,
      cash: 620,
      capex: 680,
    },
  },
  {
    id: "stk-terragrid",
    name: "TerraGrid",
    sector: "Energy",
    price: 63.9,
    volatility: 0.05,
    sentiment: 0.08,
    fundamentals: {
      revenue: 3900,
      margin: 0.22,
      debt: 740,
      growth: 0.06,
      risk: 0.24,
      cash: 540,
      capex: 520,
    },
  },
  {
    id: "stk-ember",
    name: "Ember Energy",
    sector: "Energy",
    price: 84.6,
    volatility: 0.07,
    sentiment: -0.02,
    fundamentals: {
      revenue: 5300,
      margin: 0.19,
      debt: 1250,
      growth: 0.05,
      risk: 0.3,
      cash: 780,
      capex: 760,
    },
  },
  {
    id: "stk-nordic",
    name: "Nordic Health",
    sector: "Healthcare",
    price: 54.1,
    volatility: 0.04,
    sentiment: 0.18,
    fundamentals: {
      revenue: 3100,
      margin: 0.26,
      debt: 420,
      growth: 0.08,
      risk: 0.22,
      cash: 680,
      capex: 320,
    },
  },
  {
    id: "stk-veridian",
    name: "Veridian Bio",
    sector: "Healthcare",
    price: 68.2,
    volatility: 0.06,
    sentiment: 0.1,
    fundamentals: {
      revenue: 2700,
      margin: 0.29,
      debt: 520,
      growth: 0.09,
      risk: 0.27,
      cash: 610,
      capex: 350,
    },
  },
  {
    id: "stk-pulse",
    name: "Pulse Medical",
    sector: "Healthcare",
    price: 61.5,
    volatility: 0.05,
    sentiment: 0.12,
    fundamentals: {
      revenue: 2500,
      margin: 0.24,
      debt: 380,
      growth: 0.07,
      risk: 0.23,
      cash: 590,
      capex: 300,
    },
  },
  {
    id: "stk-aurora",
    name: "Aurora Pharma",
    sector: "Healthcare",
    price: 79.4,
    volatility: 0.06,
    sentiment: 0.09,
    fundamentals: {
      revenue: 3400,
      margin: 0.27,
      debt: 600,
      growth: 0.08,
      risk: 0.25,
      cash: 720,
      capex: 410,
    },
  },
  {
    id: "stk-civitas",
    name: "Civitas Retail",
    sector: "Consumer",
    price: 38.9,
    volatility: 0.04,
    sentiment: 0.05,
    fundamentals: {
      revenue: 2200,
      margin: 0.16,
      debt: 430,
      growth: 0.04,
      risk: 0.2,
      cash: 420,
      capex: 260,
    },
  },
  {
    id: "stk-lumen",
    name: "Lumen Foods",
    sector: "Consumer",
    price: 46.3,
    volatility: 0.04,
    sentiment: 0.08,
    fundamentals: {
      revenue: 2400,
      margin: 0.18,
      debt: 390,
      growth: 0.05,
      risk: 0.18,
      cash: 460,
      capex: 240,
    },
  },
  {
    id: "stk-vetro",
    name: "Vetro Wear",
    sector: "Consumer",
    price: 52.8,
    volatility: 0.05,
    sentiment: 0.02,
    fundamentals: {
      revenue: 2100,
      margin: 0.2,
      debt: 510,
      growth: 0.03,
      risk: 0.26,
      cash: 380,
      capex: 280,
    },
  },
  {
    id: "stk-solace",
    name: "Solace Leisure",
    sector: "Consumer",
    price: 44.1,
    volatility: 0.05,
    sentiment: 0.04,
    fundamentals: {
      revenue: 1900,
      margin: 0.17,
      debt: 360,
      growth: 0.04,
      risk: 0.21,
      cash: 340,
      capex: 220,
    },
  },
  {
    id: "stk-forge",
    name: "Forge Industrials",
    sector: "Industrials",
    price: 92.3,
    volatility: 0.05,
    sentiment: 0.06,
    fundamentals: {
      revenue: 5200,
      margin: 0.21,
      debt: 1200,
      growth: 0.05,
      risk: 0.27,
      cash: 820,
      capex: 760,
    },
  },
  {
    id: "stk-atlas",
    name: "Atlas Logistics",
    sector: "Industrials",
    price: 66.9,
    volatility: 0.05,
    sentiment: 0.04,
    fundamentals: {
      revenue: 4100,
      margin: 0.19,
      debt: 780,
      growth: 0.04,
      risk: 0.24,
      cash: 650,
      capex: 520,
    },
  },
  {
    id: "stk-meridian",
    name: "Meridian Steel",
    sector: "Industrials",
    price: 58.1,
    volatility: 0.06,
    sentiment: 0.01,
    fundamentals: {
      revenue: 3700,
      margin: 0.17,
      debt: 940,
      growth: 0.03,
      risk: 0.3,
      cash: 540,
      capex: 610,
    },
  },
  {
    id: "stk-orbit",
    name: "Orbit Works",
    sector: "Industrials",
    price: 71.4,
    volatility: 0.05,
    sentiment: 0.05,
    fundamentals: {
      revenue: 4300,
      margin: 0.2,
      debt: 860,
      growth: 0.04,
      risk: 0.25,
      cash: 700,
      capex: 580,
    },
  },
];

export const bondSeeds: BondSeed[] = [
  { id: "bnd-btp-5", name: "BTP 5Y", duration: 4.5, coupon: 2.6, price: 100, volatility: 0.02 },
  { id: "bnd-bund-10", name: "Bund 10Y", duration: 8.2, coupon: 1.8, price: 100, volatility: 0.02 },
  { id: "bnd-ust-7", name: "UST 7Y", duration: 6.3, coupon: 2.2, price: 100, volatility: 0.02 },
];

export const etfSeeds: EtfSeed[] = [
  {
    id: "etf-tech",
    name: "ETF Tech Pulse",
    sector: "Tech",
    price: 82,
    volatility: 0.04,
    holdings: ["stk-aether", "stk-nova", "stk-cypher", "stk-horizon"],
    trackingFactor: 0.78,
  },
  {
    id: "etf-energy",
    name: "ETF Energy Core",
    sector: "Energy",
    price: 68,
    volatility: 0.04,
    holdings: ["stk-helios", "stk-boreal", "stk-terragrid", "stk-ember"],
    trackingFactor: 0.74,
  },
  {
    id: "etf-health",
    name: "ETF Health Shield",
    sector: "Healthcare",
    price: 64,
    volatility: 0.03,
    holdings: ["stk-nordic", "stk-veridian", "stk-pulse", "stk-aurora"],
    trackingFactor: 0.76,
  },
  {
    id: "etf-consumer",
    name: "ETF Consumer Blend",
    sector: "Consumer",
    price: 58,
    volatility: 0.03,
    holdings: ["stk-civitas", "stk-lumen", "stk-vetro", "stk-solace"],
    trackingFactor: 0.72,
  },
  {
    id: "etf-industrials",
    name: "ETF Industrial Flow",
    sector: "Industrials",
    price: 70,
    volatility: 0.04,
    holdings: ["stk-forge", "stk-atlas", "stk-meridian", "stk-orbit"],
    trackingFactor: 0.75,
  },
];

export const commoditySeeds: CommoditySeed[] = [
  { id: "cmd-gold", name: "Oro", price: 1900, volatility: 0.03 },
  { id: "cmd-oil", name: "Petrolio", price: 86, volatility: 0.06 },
];
