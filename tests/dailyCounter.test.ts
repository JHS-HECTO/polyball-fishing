import { describe, it, expect, beforeEach } from 'vitest';
import { readDaily, incrementCast, incrementFish, resetIfNewDay } from 'lib/dailyCounter';

beforeEach(() => {
  localStorage.clear();
});

describe('daily counter', () => {
  it('starts at zero', () => {
    const d = readDaily('2026-05-15');
    expect(d.casts).toBe(0);
    expect(d.fishCaught).toBe(0);
  });

  it('increments cast', () => {
    incrementCast('2026-05-15');
    incrementCast('2026-05-15');
    expect(readDaily('2026-05-15').casts).toBe(2);
  });

  it('increments fish caught', () => {
    incrementFish('2026-05-15');
    expect(readDaily('2026-05-15').fishCaught).toBe(1);
  });

  it('resets on new day', () => {
    incrementCast('2026-05-15');
    incrementCast('2026-05-15');
    resetIfNewDay('2026-05-16');
    expect(readDaily('2026-05-16').casts).toBe(0);
  });

  it('does not reset on same day', () => {
    incrementCast('2026-05-15');
    resetIfNewDay('2026-05-15');
    expect(readDaily('2026-05-15').casts).toBe(1);
  });
});
