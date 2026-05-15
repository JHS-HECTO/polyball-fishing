import { describe, it, expect } from 'vitest';
import { sortLeaderboard } from 'lib/ranking';
import type { LeaderboardEntry } from 'lib/types';

const entry = (overrides: Partial<LeaderboardEntry>): LeaderboardEntry => ({
  rank: 0,
  nickname: 'x',
  team: 'kia',
  total_score: 0,
  golden_count: 0,
  created_at: '2026-01-01T00:00:00Z',
  ...overrides,
});

describe('sortLeaderboard', () => {
  it('sorts by total_score DESC', () => {
    const sorted = sortLeaderboard([
      entry({ nickname: 'a', total_score: 100 }),
      entry({ nickname: 'b', total_score: 300 }),
      entry({ nickname: 'c', total_score: 200 }),
    ]);
    expect(sorted.map((e) => e.nickname)).toEqual(['b', 'c', 'a']);
  });

  it('uses created_at DESC as tiebreaker', () => {
    const sorted = sortLeaderboard([
      entry({ nickname: 'a', total_score: 100, created_at: '2026-01-01T00:00:00Z' }),
      entry({ nickname: 'b', total_score: 100, created_at: '2026-03-01T00:00:00Z' }),
    ]);
    expect(sorted.map((e) => e.nickname)).toEqual(['b', 'a']);
  });

  it('assigns sequential rank starting at 1', () => {
    const sorted = sortLeaderboard([
      entry({ nickname: 'a', total_score: 100 }),
      entry({ nickname: 'b', total_score: 200 }),
    ]);
    expect(sorted[0]?.rank).toBe(1);
    expect(sorted[1]?.rank).toBe(2);
  });
});
