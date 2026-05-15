import { describe, it, expect } from 'vitest';
import { rollGrade, pickSpecies, gradeConfig } from 'lib/fish';

describe('rollGrade', () => {
  it('returns trash when random=0', () => {
    expect(rollGrade(() => 0)).toBe('trash');
  });

  it('returns trash at boundary just under 0.5', () => {
    expect(rollGrade(() => 0.499)).toBe('trash');
  });

  it('returns normal at 0.5', () => {
    expect(rollGrade(() => 0.5)).toBe('normal');
  });

  it('returns normal just under 0.8', () => {
    expect(rollGrade(() => 0.799)).toBe('normal');
  });

  it('returns rare at 0.8', () => {
    expect(rollGrade(() => 0.8)).toBe('rare');
  });

  it('returns big at 0.95', () => {
    expect(rollGrade(() => 0.95)).toBe('big');
  });

  it('returns golden at 0.995', () => {
    expect(rollGrade(() => 0.995)).toBe('golden');
  });

  it('returns golden at 0.9999', () => {
    expect(rollGrade(() => 0.9999)).toBe('golden');
  });
});

describe('pickSpecies', () => {
  it('returns one of the species for the grade', () => {
    const result = pickSpecies('trash', () => 0);
    expect(result.grade).toBe('trash');
    expect(result.id).toBe('trash-1');
  });

  it('picks last species when random near 1', () => {
    const result = pickSpecies('trash', () => 0.99);
    expect(result.id).toBe('trash-3');
  });
});

describe('gradeConfig', () => {
  it('returns config for golden', () => {
    const cfg = gradeConfig('golden');
    expect(cfg.score).toBe(2000);
    expect(cfg.rounds).toBe(5);
  });
});
