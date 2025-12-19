export type RngState = number;

export type RngResult<T> = {
  value: T;
  state: RngState;
};

export function nextRng(state: RngState): RngResult<number> {
  let t = (state + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return { value, state: t >>> 0 };
}

export function rngRange(state: RngState, min: number, max: number): RngResult<number> {
  const next = nextRng(state);
  return { value: min + (max - min) * next.value, state: next.state };
}

export function rngInt(state: RngState, min: number, max: number): RngResult<number> {
  const next = nextRng(state);
  const value = Math.floor(min + (max - min + 1) * next.value);
  return { value, state: next.state };
}

export function rngPick<T>(state: RngState, items: T[]): RngResult<T> {
  const next = rngInt(state, 0, items.length - 1);
  return { value: items[next.value], state: next.state };
}

export function rngGaussian(state: RngState, mean = 0, stdev = 1): RngResult<number> {
  let nextState = state;
  let u1 = 0;
  let u2 = 0;
  while (u1 === 0) {
    const next = nextRng(nextState);
    u1 = next.value;
    nextState = next.state;
  }
  const next = nextRng(nextState);
  u2 = next.value;
  nextState = next.state;
  const mag = Math.sqrt(-2.0 * Math.log(u1));
  const z0 = mag * Math.cos(2.0 * Math.PI * u2);
  return { value: z0 * stdev + mean, state: nextState };
}

export function rngWeightedPick<T extends { weight: number }>(
  state: RngState,
  items: T[]
): RngResult<T> {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  const roll = rngRange(state, 0, total);
  let acc = 0;
  for (const item of items) {
    acc += item.weight;
    if (roll.value <= acc) {
      return { value: item, state: roll.state };
    }
  }
  return { value: items[items.length - 1], state: roll.state };
}
