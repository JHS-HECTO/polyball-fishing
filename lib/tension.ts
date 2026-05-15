import type { RandomFn } from './fish';

export type InputDirection = 'correct' | 'wrong' | 'none';

export type TensionParams = {
  up: number;   // % per second when wrong/none
  down: number; // % per second when correct
};

export function updateTension(
  current: number,
  input: InputDirection,
  dt: number,
  params: TensionParams,
): number {
  let next = current;
  if (input === 'correct') {
    next = current - params.down * dt;
  } else {
    next = current + params.up * dt;
  }
  if (next > 100) return 100;
  if (next < 0) return 0;
  return next;
}

export type RoundOutcome = 'pass' | 'escaped' | 'broken';

export function decideRoundOutcome(
  tension: number,
  escapeChance: number,
  rng: RandomFn = Math.random,
): RoundOutcome {
  if (tension >= 100) return 'broken';
  if (tension < 70) return 'pass';
  if (escapeChance <= 0) return 'pass';
  return rng() < escapeChance ? 'escaped' : 'pass';
}
