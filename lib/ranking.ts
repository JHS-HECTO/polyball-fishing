import type { LeaderboardEntry } from './types';

export function sortLeaderboard(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  const sorted = [...entries].sort((a, b) => {
    if (b.total_score !== a.total_score) return b.total_score - a.total_score;
    return b.created_at.localeCompare(a.created_at);
  });
  return sorted.map((e, i) => ({ ...e, rank: i + 1 }));
}

export function formatScore(n: number): string {
  return n.toLocaleString('ko-KR');
}
