import { describe, it, expect } from 'vitest';
import { updateTension, decideRoundOutcome } from 'lib/tension';

describe('updateTension', () => {
  it('increases when input wrong', () => {
    expect(updateTension(20, 'wrong', 1, { up: 10, down: 12 })).toBeCloseTo(30);
  });

  it('decreases when input correct', () => {
    expect(updateTension(50, 'correct', 1, { up: 10, down: 12 })).toBeCloseTo(38);
  });

  it('stays neutral when no input', () => {
    expect(updateTension(50, 'none', 1, { up: 10, down: 12 })).toBeCloseTo(60);
  });

  it('clamps at 100', () => {
    expect(updateTension(95, 'wrong', 1, { up: 30, down: 12 })).toBe(100);
  });

  it('clamps at 0', () => {
    expect(updateTension(5, 'correct', 1, { up: 10, down: 12 })).toBe(0);
  });

  it('respects partial dt', () => {
    expect(updateTension(50, 'wrong', 0.5, { up: 10, down: 12 })).toBeCloseTo(55);
  });
});

describe('decideRoundOutcome', () => {
  it('breaks line at 100% tension', () => {
    expect(decideRoundOutcome(100, 0.35, () => 0.5)).toBe('broken');
  });

  it('passes safely when tension < 70%', () => {
    expect(decideRoundOutcome(69, 0.35, () => 0.99)).toBe('pass');
  });

  it('escapes when tension high and rng below escape chance', () => {
    expect(decideRoundOutcome(80, 0.35, () => 0.2)).toBe('escaped');
  });

  it('passes when tension high but rng above escape chance', () => {
    expect(decideRoundOutcome(80, 0.35, () => 0.5)).toBe('pass');
  });

  it('does not escape when chance is 0', () => {
    expect(decideRoundOutcome(99, 0, () => 0)).toBe('pass');
  });
});
